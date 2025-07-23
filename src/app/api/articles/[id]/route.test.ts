import { GET } from "@/app/api/articles/[id]/route";
import { getArticleById } from "@/controllers/articleController";
import { NextResponse } from "next/server";

// Mock Request
global.Request = jest.fn().mockImplementation((url) => ({
  url,
}));

jest.mock("@/controllers/articleController", () => ({
  getArticleById: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockGetArticleById = getArticleById as jest.MockedFunction<typeof getArticleById>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
});

describe("/api/articles/[id] - GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns article when found", async () => {
    const mockArticle = {
      _id: "test-id",
      title: "Test Article",
      content: "Test content",
      tags: ["test"],
    };

    mockGetArticleById.mockResolvedValue(mockArticle);

    const request = new Request("http://localhost/api/articles/test-id");
    const params = { params: Promise.resolve({ id: "test-id" }) };

    await GET(request, params);

    expect(mockGetArticleById).toHaveBeenCalledWith("test-id");
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: true, data: mockArticle },
      { status: 200 }
    );
  });

  it("returns 404 when article not found", async () => {
    mockGetArticleById.mockResolvedValue(null);

    const request = new Request("http://localhost/api/articles/nonexistent");
    const params = { params: Promise.resolve({ id: "nonexistent" }) };

    await GET(request, params);

    expect(mockGetArticleById).toHaveBeenCalledWith("nonexistent");
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Article not found" },
      { status: 404 }
    );
  });

  it("returns 500 on server error", async () => {
    mockGetArticleById.mockRejectedValue(new Error("Database error"));

    const request = new Request("http://localhost/api/articles/test-id");
    const params = { params: Promise.resolve({ id: "test-id" }) };

    await GET(request, params);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  });
});
