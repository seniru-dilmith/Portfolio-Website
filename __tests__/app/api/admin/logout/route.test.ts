import { POST } from "@/app/api/admin/logout/route";
import { verifyToken } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

jest.mock("@/middleware/auth", () => ({
  verifyToken: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("/api/admin/logout - POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs out successfully when authenticated", async () => {
    const mockRequest = {} as NextRequest;

    mockVerifyToken.mockResolvedValue(undefined as any);

    await POST(mockRequest);

    expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
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

  it("handles internal server errors", async () => {
    const mockRequest = {} as NextRequest;

    mockVerifyToken.mockRejectedValue(new Error("Internal error"));

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  });
});
