import { GET, POST, PUT, DELETE } from "@/app/api/articles/route";
import { 
  getArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from "@/controllers/articleController";
import { verifyToken } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

// Mock Request and NextRequest
global.Request = jest.fn().mockImplementation((url) => ({
  url,
  json: jest.fn(),
}));

jest.mock("@/controllers/articleController", () => ({
  getArticles: jest.fn(),
  createArticle: jest.fn(),
  updateArticle: jest.fn(),
  deleteArticle: jest.fn(),
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

const mockGetArticles = getArticles as jest.MockedFunction<typeof getArticles>;
const mockCreateArticle = createArticle as jest.MockedFunction<typeof createArticle>;
const mockUpdateArticle = updateArticle as jest.MockedFunction<typeof updateArticle>;
const mockDeleteArticle = deleteArticle as jest.MockedFunction<typeof deleteArticle>;
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
});

describe("/api/articles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns articles successfully", async () => {
      const mockArticles = [
        { _id: "1", title: "Test Article", content: "Test content", tags: ["test"] },
      ];

      mockGetArticles.mockResolvedValue(mockArticles);

      await GET();

      expect(mockGetArticles).toHaveBeenCalled();
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: mockArticles },
        { status: 200 }
      );
    });

    it("handles errors", async () => {
      mockGetArticles.mockRejectedValue(new Error("Database error"));

      await GET();

      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    });
  });

  describe("POST", () => {
    it("creates article successfully when authenticated", async () => {
      const mockArticle = { _id: "1", title: "New Article", content: "New content", tags: ["new"] };
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          title: "New Article",
          content: "New content", 
          tags: ["new"]
        })
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockCreateArticle.mockResolvedValue(mockArticle);

      await POST(mockRequest);

      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockCreateArticle).toHaveBeenCalledWith({
        title: "New Article",
        content: "New content",
        tags: ["new"],
        images: []
      });
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: mockArticle },
        { status: 201 }
      );
    });

    it("extracts images from markdown content", async () => {
      const mockArticle = { _id: "1", title: "Img Article", content: "![img](http://test.com/img.jpg)", tags: [] };
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          title: "Img Article",
          content: "![img](http://test.com/img.jpg)",
          tags: []
        })
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue({ userId: "1" });
      mockCreateArticle.mockResolvedValue(mockArticle);

      await POST(mockRequest);

      expect(mockCreateArticle).toHaveBeenCalledWith(expect.objectContaining({
        images: ["http://test.com/img.jpg"]
      }));
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
    it("updates article successfully when authenticated", async () => {
      const mockUpdatedArticle = { _id: "1", title: "Updated Article", content: "Updated content", tags: ["updated"] };
      const mockRequest = {
        url: "http://localhost/api/articles?id=1",
        json: jest.fn().mockResolvedValue({
          title: "Updated Article",
          content: "Updated content",
          tags: ["updated"]
        })
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockUpdateArticle.mockResolvedValue(mockUpdatedArticle);

      await PUT(mockRequest);

      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockUpdateArticle).toHaveBeenCalledWith("1", {
        title: "Updated Article",
        content: "Updated content",
        tags: ["updated"],
        images: []
      });
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, data: mockUpdatedArticle },
        { status: 200 }
      );
    });

    it("returns 400 when id is missing", async () => {
      const mockRequest = {
        url: "http://localhost/api/articles",
        json: jest.fn()
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });

      await PUT(mockRequest);

      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Missing id query param" },
        { status: 400 }
      );
    });
  });

  describe("DELETE", () => {
    it("deletes article successfully when authenticated", async () => {
      const mockRequest = {
        url: "http://localhost/api/articles?id=1"
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });
      mockDeleteArticle.mockResolvedValue(undefined);

      await DELETE(mockRequest);

      expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
      expect(mockDeleteArticle).toHaveBeenCalledWith("1");
      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: true, message: "Article deleted successfully" },
        { status: 200 }
      );
    });

    it("returns 400 when id is missing", async () => {
      const mockRequest = {
        url: "http://localhost/api/articles"
      } as unknown as NextRequest;

      mockVerifyToken.mockResolvedValue({ userId: "test-user-id" });

      await DELETE(mockRequest);

      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Missing id query param" },
        { status: 400 }
      );
    });
  });
});
