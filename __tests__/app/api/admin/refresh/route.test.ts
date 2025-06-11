import { POST } from "@/app/api/admin/refresh/route";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Mock Request
global.Request = jest.fn().mockImplementation((url) => ({
  url,
  json: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("/api/admin/refresh - POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.NEXT_JWT_REFRESH_SECRET = "refresh-secret";
    process.env.NEXT_JWT_ACCESS_SECRET = "access-secret";
    process.env.NEXT_JWT_ACCESS_EXPIRY = "15m";
  });

  it("refreshes token successfully with valid refresh token", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ refreshToken: "valid-refresh-token" })
    } as unknown as NextRequest;

    const mockDecodedToken = { userId: "user123" };

    mockJwt.verify.mockReturnValue(mockDecodedToken as any);
    mockJwt.sign.mockReturnValue("new-access-token");

    await POST(mockRequest);

    expect(mockJwt.verify).toHaveBeenCalledWith("valid-refresh-token", "refresh-secret");
    expect(mockJwt.sign).toHaveBeenCalledWith(
      { userId: "user123" },
      "access-secret",
      { expiresIn: "15m" }
    );
    expect(mockNextResponse).toHaveBeenCalledWith(
      {
        success: true,
        data: { accessToken: "new-access-token" }
      },
      { status: 200 }
    );
  });

  it("returns 400 when refresh token is missing", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({})
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Refresh token is required" },
      { status: 400 }
    );
  });

  it("returns 401 when refresh token is invalid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ refreshToken: "invalid-token" })
    } as unknown as NextRequest;

    mockJwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Invalid refresh token" },
      { status: 401 }
    );
  });

  it("handles internal server errors", async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error("JSON parse error"))
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  });
});
