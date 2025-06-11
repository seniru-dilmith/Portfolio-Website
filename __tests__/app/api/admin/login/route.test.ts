import { POST } from "@/app/api/admin/login/route";
import dbConnect from "@/util/dbConnect";
import User from "@/models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Mock Request
global.Request = jest.fn().mockImplementation((url) => ({
  url,
  json: jest.fn(),
}));

jest.mock("@/util/dbConnect", () => jest.fn());
jest.mock("@/models/UserModel", () => ({
  findOne: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockImplementation(() => ""),
}));
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockUser = User as jest.Mocked<typeof User>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("Admin Login API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue({} as mongoose.Connection);
    
    // Mock environment variables
    process.env.NEXT_JWT_ACCESS_SECRET = "access-secret";
    process.env.NEXT_JWT_ACCESS_SECRET = "access-secret";
    process.env.NEXT_JWT_REFRESH_SECRET = "refresh-secret";
    process.env.NEXT_JWT_ACCESS_EXPIRY = "15m";
    process.env.NEXT_JWT_REFRESH_EXPIRY = "7d";
  });

  it("logs in successfully with valid credentials", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ 
        email: "admin@example.com", 
        password: "password123" 
      })
    } as unknown as Request;

    const mockUserData = {
      _id: "user123",
      email: "admin@example.com",
      password: "hashedpassword"
    };

    mockUser.findOne.mockResolvedValue(mockUserData);
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockJwt.sign.mockImplementationOnce(() => "access-token");
    mockJwt.sign.mockImplementationOnce(() => "refresh-token");

    // Mock cookie functionality
    const mockCookiesSet = jest.fn();
    mockNextResponse.mockReturnValue({
      cookies: {
        set: mockCookiesSet
      }
    } as unknown as NextResponse);

    await POST(mockRequest);

    expect(mockDbConnect).toHaveBeenCalled();
    expect(mockUser.findOne).toHaveBeenCalledWith({ email: "admin@example.com" });
    expect(mockBcrypt.compare).toHaveBeenCalledWith("password123", "hashedpassword");
    expect(mockJwt.sign).toHaveBeenCalledTimes(2);
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: true, message: "Login Successful" },
      { status: 200 }
    );
    
    // Verify cookie sets were called
    expect(mockCookiesSet).toHaveBeenCalledWith("accessToken", "access-token", expect.any(Object));
    expect(mockCookiesSet).toHaveBeenCalledWith("refreshToken", "refresh-token", expect.any(Object));
  });

  it("returns 400 when email is missing", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ password: "password123" })
    } as unknown as Request;

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Both email and password are required." },
      { status: 400 }
    );
    expect(mockDbConnect).not.toHaveBeenCalled();
  });

  it("returns 400 when password is missing", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: "admin@example.com" })
    } as unknown as Request;

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Both email and password are required." },
      { status: 400 }
    );
    expect(mockDbConnect).not.toHaveBeenCalled();
  });

  it("returns 404 when user not found", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ 
        email: "notfound@example.com", 
        password: "password123" 
      })
    } as unknown as Request;

    mockUser.findOne.mockResolvedValue(null);

    await POST(mockRequest);

    expect(mockUser.findOne).toHaveBeenCalledWith({ email: "notfound@example.com" });
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Invalid username" },
      { status: 404 }
    );
  });

  it("returns 401 when password is invalid", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ 
        email: "admin@example.com", 
        password: "wrongpassword" 
      })
    } as unknown as Request;

    const mockUserData = {
      _id: "user123",
      email: "admin@example.com",
      password: "hashedpassword"
    };

    mockUser.findOne.mockResolvedValue(mockUserData);
    mockBcrypt.compare.mockResolvedValue(false as never);

    await POST(mockRequest);

    expect(mockBcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedpassword");
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  });

  it("handles database errors", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ 
        email: "admin@example.com", 
        password: "password123" 
      })
    } as unknown as Request;

    mockDbConnect.mockRejectedValue(new Error("Database connection failed"));

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  });
});
