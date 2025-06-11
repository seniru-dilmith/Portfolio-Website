import { POST } from "@/app/api/upload/route";
import { verifyToken } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

// Mock Request and NextRequest
global.Request = jest.fn().mockImplementation((url) => ({
  url,
  formData: jest.fn(),
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

// Mock fs/promises
jest.mock("fs/promises", () => ({
  writeFile: jest.fn(),
  mkdir: jest.fn(),
}));

// Mock path
jest.mock("path", () => ({
  join: jest.fn((...args) => args.join("/")),
  extname: jest.fn((filename) => {
    const parts = filename.split(".");
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : "";
  }),
}));

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

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

  it("returns 400 when no file is provided", async () => {
    const mockFormData = new FormData();
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData)
    } as unknown as NextRequest;

    mockVerifyToken.mockResolvedValue(undefined as any);

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "No file provided" },
      { status: 400 }
    );
  });

  it("handles internal server errors", async () => {
    const mockRequest = {
      formData: jest.fn().mockRejectedValue(new Error("FormData error"))
    } as unknown as NextRequest;

    mockVerifyToken.mockResolvedValue(undefined as any);

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  });
});
