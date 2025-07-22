import { GET, POST, PUT, DELETE } from "@/app/api/projects/route";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/controllers/projectController";
import { verifyToken } from "@/middleware/auth";
import { deleteFolder } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

// Mock Request and NextRequest
global.Request = jest.fn().mockImplementation((url) => ({ url, json: jest.fn() }));

jest.mock("@/controllers/projectController", () => ({
  getProjects: jest.fn(),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
}));
jest.mock("@/middleware/auth", () => ({
  verifyToken: jest.fn(),
}));
jest.mock("@/lib/firebaseAdmin", () => ({
  deleteFolder: jest.fn(),
}));
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;
const mockCreateProject = createProject as jest.MockedFunction<typeof createProject>;
const mockUpdateProject = updateProject as jest.MockedFunction<typeof updateProject>;
const mockDeleteProject = deleteProject as jest.MockedFunction<typeof deleteProject>;
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockDeleteFolder = deleteFolder as jest.MockedFunction<typeof deleteFolder>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("/api/projects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns projects successfully", async () => {
      const mockProjects = [{
        _id: "1",
        title: "Test Project",
        description: "A test project",
        technologies: ["TypeScript"],
        links: [{ name: "GitHub", url: "https://github.com" }],
        imageURLs: ["https://example.com/image.png"],
        createdAt: new Date()
      }];
      mockGetProjects.mockResolvedValue(mockProjects);
      await GET();
      expect(mockGetProjects).toHaveBeenCalled();
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: mockProjects },
        { status: 200 }
      );
    });
    it("handles errors", async () => {
      mockGetProjects.mockRejectedValue(new Error("Database error"));
      await GET();
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    });
  });

  describe("POST", () => {
    it("creates project successfully when authenticated", async () => {
      const mockProject = {
        _id: "1",
        title: "New Project",
        description: "A new project",
        technologies: ["TypeScript"],
        links: [{ name: "GitHub", url: "https://github.com" }],
        imageURLs: ["https://example.com/image.png"],
        createdAt: new Date()
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ name: "New Project" })
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockCreateProject.mockResolvedValue(mockProject);
      await POST(mockRequest);
      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockCreateProject).toHaveBeenCalledWith({ name: "New Project" });
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: mockProject },
        { status: 201 }
      );
    });
    it("returns 401 when not authenticated", async () => {
      const mockRequest = {} as NextRequest;
      mockVerifyToken.mockRejectedValue(new Error("Unauthorized"));
      await POST(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    });
    it("handles internal server errors", async () => {
      const mockRequest = {} as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockCreateProject.mockRejectedValue(new Error("Some error"));
      mockRequest.json = jest.fn().mockResolvedValue({ name: "fail" });
      await POST(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Some error" },
        { status: 500 }
      );
    });
  });

  describe("PUT", () => {
    it("updates project successfully when authenticated", async () => {
      const mockUpdated = {
        _id: "1",
        title: "Updated Project",
        description: "Updated description",
        technologies: ["TypeScript"],
        links: [{ name: "GitHub", url: "https://github.com" }],
        imageURLs: ["https://example.com/image.png"],
        createdAt: new Date()
      };
      const mockRequest = {
        url: "http://localhost/api/projects?id=1",
        json: jest.fn().mockResolvedValue({ name: "Updated Project" })
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockUpdateProject.mockResolvedValue(mockUpdated);
      await PUT(mockRequest);
      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockUpdateProject).toHaveBeenCalledWith("1", { name: "Updated Project" });
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: mockUpdated }
      );
    });
    it("returns 400 when id is missing", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects",
        json: jest.fn()
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      await PUT(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Missing id query param" },
        { status: 400 }
      );
    });
    it("returns 404 when project not found", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1",
        json: jest.fn().mockResolvedValue({ name: "Updated Project" })
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockUpdateProject.mockResolvedValue(null);
      await PUT(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    });
    it("returns 401 when not authenticated", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1",
        json: jest.fn().mockResolvedValue({ name: "Updated Project" })
      } as unknown as NextRequest;
      mockVerifyToken.mockRejectedValue(new Error("Unauthorized"));
      await PUT(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    });
    it("handles internal server errors", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1",
        json: jest.fn().mockResolvedValue({ name: "fail" })
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockUpdateProject.mockRejectedValue(new Error("Some error"));
      await PUT(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Some error" },
        { status: 500 }
      );
    });
  });

  describe("DELETE", () => {
    it("deletes project successfully when authenticated", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1"
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      const deletedProject = {
        _id: "1",
        title: "Deleted Project",
        description: "Deleted description",
        technologies: ["TypeScript"],
        links: [{ name: "GitHub", url: "https://github.com" }],
        imageURLs: ["https://example.com/image.png"],
        createdAt: new Date()
      };
      mockDeleteProject.mockResolvedValue(deletedProject);
      mockDeleteFolder.mockResolvedValue(undefined);
      await DELETE(mockRequest);
      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockDeleteProject).toHaveBeenCalledWith("1");
      expect(mockDeleteFolder).toHaveBeenCalledWith("projects/1");
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: { _id: "1" } }
      );
    });
    it("returns 400 when id is missing", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects"
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      await DELETE(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Missing id query param" },
        { status: 400 }
      );
    });
    it("returns 404 when project not found", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1"
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockDeleteProject.mockResolvedValue(null);
      await DELETE(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    });
    it("returns 401 when not authenticated", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1"
      } as unknown as NextRequest;
      mockVerifyToken.mockRejectedValue(new Error("Unauthorized"));
      await DELETE(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    });
    it("handles internal server errors", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1"
      } as unknown as NextRequest;
      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockDeleteProject.mockRejectedValue(new Error("Some error"));
      await DELETE(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Some error" },
        { status: 500 }
      );
    });
  });
});
