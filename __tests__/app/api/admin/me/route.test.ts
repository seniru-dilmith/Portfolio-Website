import { GET } from "@/app/api/admin/me/route";
import { verifyToken } from "@/middleware/auth";
import dbConnect from "@/util/dbConnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

jest.mock("@/middleware/auth", () => ({
  verifyToken: jest.fn(),
}));

jest.mock("@/util/dbConnect", () => jest.fn());

jest.mock("@/models/UserModel", () => ({
  findById: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockUser = User as jest.Mocked<typeof User>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("/api/admin/me - GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("returns user data when authenticated", async () => {
    const mockRequest = {} as NextRequest;
    const mockUserData = {
      _id: "user123",
      email: "admin@example.com",
      name: "Admin User"
    };

    mockVerifyToken.mockResolvedValue({ userId: "user123" } as any);
    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUserData)
    } as any);

    await GET(mockRequest);

    expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
    expect(mockDbConnect).toHaveBeenCalled();
    expect(mockUser.findById).toHaveBeenCalledWith("user123");
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: true, data: mockUserData },
      { status: 200 }
    );
  });

  it("returns 401 when not authenticated", async () => {
    const mockRequest = {} as NextRequest;

    mockVerifyToken.mockRejectedValue(new Error("Unauthorized"));

    await GET(mockRequest);

    expect(mockVerifyToken).toHaveBeenCalledWith(mockRequest);
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  });

  it("returns 404 when user not found", async () => {
    const mockRequest = {} as NextRequest;

    mockVerifyToken.mockResolvedValue({ userId: "user123" } as any);
    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    } as any);

    await GET(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  });

  it("handles internal server errors", async () => {
    const mockRequest = {} as NextRequest;

    mockVerifyToken.mockResolvedValue({ userId: "user123" } as any);
    mockDbConnect.mockRejectedValue(new Error("Database error"));

    await GET(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  });
});
