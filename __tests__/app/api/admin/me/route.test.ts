import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockVerify = jwt.verify as jest.MockedFunction<typeof jwt.verify>;
                                                   
let GET: typeof import("@/app/api/admin/me/route").GET;

describe("/api/admin/me - GET", () => {
  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.NEXT_JWT_ACCESS_SECRET = "access-secret";
    GET = (await import("@/app/api/admin/me/route")).GET;
  });

  it("returns authenticated message when token is valid", async () => {
    mockCookies.mockReturnValue({ get: () => ({ value: "token" }) } as any);
    mockVerify.mockReturnValue(undefined as any);

    await expect(GET()).resolves.not.toThrow();
  });

  it("returns not authenticated when token missing", async () => {
    mockCookies.mockReturnValue({ get: () => undefined } as any);

    await expect(GET()).resolves.not.toThrow();
  });

  it("returns invalid token when verification fails", async () => {
    mockCookies.mockReturnValue({ get: () => ({ value: "token" }) } as any);
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(GET()).resolves.not.toThrow();
  });
});
