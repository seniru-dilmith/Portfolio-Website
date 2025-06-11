import { GET, POST, PUT, DELETE } from "@/app/api/projects/route";
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from "@/controllers/projectController";
import { verifyToken } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

// Mock Request and NextRequest
global.Request = jest.fn().mockImplementation((url) => ({
  url,
  json: jest.fn(),
}));

jest.mock("@/controllers/projectController", () => ({
  getProjects: jest.fn(),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
}));

jest.mock("@/middleware/auth", () => ({
  verifyToken: jest.fn(),
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
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("/api/projects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns projects successfully", async () => {
      const mockProjects = [
        {
          _id: "1",
          title: "Test Project",
          description: "Test description",
          technologies: ["React", "TypeScript"],
          githubURL: "https://github.com/test",
          imageURL: "https://example.com/image.png",
          createdAt: "2024-01-01"
        },
      ];

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
        description: "New description",
        technologies: ["Vue", "JavaScript"],
        githubURL: "https://github.com/new",
        imageURL: "https://example.com/new.png",
        createdAt: "2024-01-01"
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          title: "New Project",
          description: "New description",
          technologies: ["Vue", "JavaScript"],
          githubURL: "https://github.com/new",
          imageURL: "https://example.com/new.png",
          createdAt: "2024-01-01"
        })
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue(undefined as any);
      mockCreateProject.mockResolvedValue(mockProject);

      await POST(mockRequest);

      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockCreateProject).toHaveBeenCalledWith({
        title: "New Project",
        description: "New description",
        technologies: ["Vue", "JavaScript"],
        githubURL: "https://github.com/new",
        imageURL: "https://example.com/new.png",
        createdAt: "2024-01-01"
      });
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
  });

  describe("PUT", () => {
    it("updates project successfully when authenticated", async () => {
      const mockUpdatedProject = {
        _id: "1",
        title: "Updated Project",
        description: "Updated description",
        technologies: ["React", "Next.js"],
        githubURL: "https://github.com/updated",
        imageURL: "https://example.com/updated.png",
        createdAt: "2024-01-01"
      };
      const mockRequest = {
        url: "http://localhost/api/projects?id=1",
        json: jest.fn().mockResolvedValue({
          title: "Updated Project",
          description: "Updated description",
          technologies: ["React", "Next.js"],
          githubURL: "https://github.com/updated",
          imageURL: "https://example.com/updated.png",
          createdAt: "2024-01-01"
        })
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue(undefined as any);
      mockUpdateProject.mockResolvedValue(mockUpdatedProject);

      await PUT(mockRequest);

      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockUpdateProject).toHaveBeenCalledWith("1", {
        title: "Updated Project",
        description: "Updated description",
        technologies: ["React", "Next.js"],
        githubURL: "https://github.com/updated",
        imageURL: "https://example.com/updated.png",
        createdAt: "2024-01-01"
      });
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: mockUpdatedProject }
      );
    });

    it("returns 400 when id is missing", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects",
        json: jest.fn()
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue(undefined as any);

      await PUT(mockRequest);

      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Missing id query param" },
        { status: 400 }
      );
    });
  });

  describe("DELETE", () => {
    it("deletes project successfully when authenticated", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects?id=1"
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue(undefined as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockDeleteProject.mockResolvedValue({ _id: "1" } as any);

      await DELETE(mockRequest);

      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockDeleteProject).toHaveBeenCalledWith("1");
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: { _id: "1" } }
      );
    });

    it("returns 400 when id is missing", async () => {
      const mockRequest = {
        url: "http://localhost/api/projects"
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue(undefined as any);

      await DELETE(mockRequest);

      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Missing id query param" },
        { status: 400 }
      );
    });
  });
});
