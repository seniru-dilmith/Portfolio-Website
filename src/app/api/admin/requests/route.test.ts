import { GET } from "@/app/api/admin/requests/route";
import WorkRequest from "@/models/WorkRequest";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/models/WorkRequest", () => ({
  find: jest.fn(),
}));

jest.mock("@/util/dbConnect", () => jest.fn());

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockFind = WorkRequest.find as jest.Mock;
const mockCookies = cookies as jest.Mock;
const mockVerify = verify as jest.Mock;
const mockNextResponse = NextResponse.json as jest.Mock;

describe("/api/admin/requests GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });
    
    const req = {} as NextRequest;

    await GET(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: "Unauthorized" },
      { status: 401 }
    );
  });

  it("should return 401 if invalid token", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "invalid-token" }),
    });
    mockVerify.mockImplementation(() => { throw new Error("Invalid"); });

    const req = {} as NextRequest;

    await GET(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: "Unauthorized" },
      { status: 401 }
    );
  });

  it("should return requests if authenticated", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });
    mockVerify.mockReturnValue({ userId: "admin" });

    const mockRequests = [
      {
        _id: "1",
        name: "User 1",
        email: "user1@example.com",
        title: "Title 1",
        description: "Desc 1",
        status: "pending",
        createdAt: new Date(),
      },
    ];
    // Mocking the chainable .sort()
    mockFind.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockRequests),
    });

    const req = {} as NextRequest;

    await GET(req);

    expect(mockFind).toHaveBeenCalled();
    expect(mockNextResponse).toHaveBeenCalledWith(
        expect.arrayContaining([
            expect.objectContaining({ name: "User 1" })
        ])
    );
  });

  it("should return 500 on database error", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });
    mockVerify.mockReturnValue({ userId: "admin" });

    mockFind.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("DB Error")),
    });

    const req = {} as NextRequest;

    await GET(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
});

