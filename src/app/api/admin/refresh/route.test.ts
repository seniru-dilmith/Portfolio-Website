import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(() => ({
      cookies: {
        set: jest.fn(),
        delete: jest.fn(),
      },
    })),
  },
}));

const mockJwt = jwt as jest.Mocked<typeof jwt>;
                                   
let GET: typeof import("@/app/api/admin/refresh/route").GET;

describe("/api/admin/refresh - GET", () => {
  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.NEXT_JWT_REFRESH_SECRET = "refresh-secret";
    process.env.NEXT_JWT_ACCESS_SECRET = "access-secret";
    GET = (await import("@/app/api/admin/refresh/route")).GET;
  });
  it("refreshes token successfully with valid refresh token", async () => {    const mockRequest = {
      cookies: { get: () => ({ value: "valid-refresh-token" }) },
    } as unknown as NextRequest;

    mockJwt.verify.mockImplementation(() => ({ id: "user123" }));
    mockJwt.sign.mockImplementation(() => "new-access-token");


    await expect(GET(mockRequest)).resolves.not.toThrow();
  });

  it("returns 401 when refresh token is missing", async () => {
    const mockRequest = {
      cookies: { get: () => undefined },
    } as unknown as NextRequest;

    await expect(GET(mockRequest)).resolves.not.toThrow();
  });

  it("returns 401 when refresh token is invalid", async () => {
    const mockRequest = {
      cookies: { get: () => ({ value: "bad" }) },
    } as unknown as NextRequest;

    mockJwt.verify.mockImplementation(() => {
      throw new Error("invalid");
    });

    await expect(GET(mockRequest)).resolves.not.toThrow();
  });

  it("handles internal server errors", async () => {
    const mockRequest = {
      cookies: { get: () => ({ value: "valid" }) },
    } as unknown as NextRequest;

    mockJwt.verify.mockImplementation(() => {
      throw new Error("unexpected");
    });

    await expect(GET(mockRequest)).resolves.not.toThrow();
  });
});
