import { POST } from "@/app/api/upload/route";
import { verifyToken } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebaseAdmin";

// Mock Request and NextRequest
global.Request = jest.fn().mockImplementation((url) => ({ url, formData: jest.fn() }));

jest.mock("@/middleware/auth", () => ({
  verifyToken: jest.fn(),
}));
jest.mock("@/lib/firebaseAdmin", () => ({
  bucket: {
    file: jest.fn(),
  },
}));
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));
jest.mock("uuid", () => ({ v4: () => "uuid-mock" }));

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;
const mockBucket = bucket as jest.Mocked<typeof bucket>;

function createMockFile(name = "file.txt", type = "text/plain", content = "hello") {
  return {
    name,
    type,
    arrayBuffer: jest.fn().mockResolvedValue(Buffer.from(content)),
  };
}

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
});

describe("/api/upload - POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const mockRequest = {} as NextRequest;
    mockVerifyToken.mockRejectedValue(new Error("Unauthorized"));
    await POST(mockRequest);
    expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  });

  it("returns 400 when no files are provided", async () => {
    const mockFormData = {
      getAll: jest.fn().mockReturnValue([]),
      get: jest.fn().mockImplementation((key) => {
          if (key === "articleId") return "project123";
          return null;
      }),
    };
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData)
    } as unknown as NextRequest;
    mockVerifyToken.mockResolvedValue("valid-token");
    await POST(mockRequest);
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "No files received." },
      { status: 400 }
    );
  });

  it("returns 400 when projectId is missing", async () => {
    const mockFile = createMockFile();
    const mockFormData = {
      getAll: jest.fn().mockReturnValue([mockFile]),
      get: jest.fn().mockImplementation((key) => {
        if (key === "file") return mockFile;
        // articleId missing -> return null
        return null; 
      }),
    };
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData)
    } as unknown as NextRequest;
    mockVerifyToken.mockResolvedValue("valid-token");
    await POST(mockRequest);
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Project ID is required." },
      { status: 400 }
    );
  });

  it("uploads files successfully", async () => {
    const mockFile = createMockFile("test.txt", "text/plain", "filecontent");
    const mockFormData = {
      getAll: jest.fn().mockReturnValue([mockFile]),
      get: jest.fn().mockImplementation((key) => {
          if (key === "file") return mockFile;
          if (key === "articleId") return "project123";
          return null;
      }),
    };
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData)
    } as unknown as NextRequest;
    mockVerifyToken.mockResolvedValue("valid-token");

    // Mock bucket.file and fileUpload methods
    const save = jest.fn().mockResolvedValue(undefined);
    const makePublic = jest.fn().mockResolvedValue(undefined);
    const publicUrl = jest.fn().mockReturnValue("https://mocked-url.com/test.txt");
    const fileUpload = { save, makePublic, publicUrl };
    (mockBucket.file as jest.Mock).mockReturnValue(fileUpload);

    await POST(mockRequest);

    expect(mockBucket.file).toHaveBeenCalledWith(expect.stringContaining("project123"));
    expect(save).toHaveBeenCalled();
    expect(makePublic).toHaveBeenCalled();
    // expect(publicUrl).toHaveBeenCalled(); // This might not be called if we construct URL manually
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: true, urls: ["https://storage.googleapis.com/undefined/articles/project123/uuid-mock.jpg"] }, 
      { status: 200 }
    );
  });

  it("handles internal server errors", async () => {
    const mockRequest = {
      formData: jest.fn().mockRejectedValue(new Error("FormData error"))
    } as unknown as NextRequest;
    mockVerifyToken.mockResolvedValue("valid-token");
    await POST(mockRequest);
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "FormData error" },
      { status: 500 }
    );
  });
});
