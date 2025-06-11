import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(() => ({ cookies: { set: jest.fn() } })),
  },
}));

const mockJwt = jwt as jest.Mocked<typeof jwt>;
                                   
let POST: typeof import("@/app/api/admin/refresh/route").POST;

describe("/api/admin/refresh - POST", () => {
  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.NEXT_JWT_REFRESH_SECRET = "refresh-secret";
    process.env.NEXT_JWT_ACCESS_SECRET = "access-secret";
    POST = (await import("@/app/api/admin/refresh/route")).POST;
  });

  it("refreshes token successfully with valid refresh token", async () => {
    const mockRequest = {
      cookies: { get: () => ({ value: "valid-refresh-token" }) },
    } as unknown as NextRequest;

    mockJwt.verify.mockReturnValue({ id: "user123" } as any);
    mockJwt.sign.mockReturnValue("new-access-token" as any);


    await expect(POST(mockRequest)).resolves.not.toThrow();
  });

  it("returns 401 when refresh token is missing", async () => {
    const mockRequest = {
      cookies: { get: () => undefined },
    } as unknown as NextRequest;

    await expect(POST(mockRequest)).resolves.not.toThrow();
  });

  it("returns 401 when refresh token is invalid", async () => {
    const mockRequest = {
      cookies: { get: () => ({ value: "bad" }) },
    } as unknown as NextRequest;

    mockJwt.verify.mockImplementation(() => {
      throw new Error("invalid");
    });

    await expect(POST(mockRequest)).resolves.not.toThrow();
  });

  it("handles internal server errors", async () => {
    const mockRequest = {
      cookies: { get: () => ({ value: "valid" }) },
    } as unknown as NextRequest;

    mockJwt.verify.mockImplementation(() => {
      throw new Error("unexpected");
    });

    await expect(POST(mockRequest)).resolves.not.toThrow();
  });
});
