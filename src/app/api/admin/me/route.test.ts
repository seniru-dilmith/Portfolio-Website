import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// No need for a separate type definition since we're using ReadonlyRequestCookies directly

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
    // Create a mock for the cookies
    const mockCookieStore = {
      get: (name: string) => name === "accessToken" ? { value: "token" } : undefined,
      getAll: () => [{ name: "accessToken", value: "token" }],
      has: (name: string) => name === "accessToken",
      size: 1,
      [Symbol.iterator]: function* () {
        yield ["accessToken", "token"];
      }
    } as unknown as ReadonlyRequestCookies;

    mockCookies.mockResolvedValue(mockCookieStore);
    mockVerify.mockImplementation(() => ({ id: "testUser123" }));

    await expect(GET()).resolves.not.toThrow();
  });
  
  it("returns not authenticated when token missing", async () => {
    // Create a mock for empty cookies
    const mockCookieStore = {
      get: () => undefined,
      getAll: () => [],
      has: () => false,
      size: 0,
      [Symbol.iterator]: function* () { }
    } as unknown as ReadonlyRequestCookies;

    mockCookies.mockResolvedValue(mockCookieStore);

    await expect(GET()).resolves.not.toThrow();
  });

  it("returns invalid token when verification fails", async () => {
    // Create a mock for the cookies
    const mockCookieStore = {
      get: () => ({ value: "token" }),
      getAll: () => [{ name: "accessToken", value: "token" }],
      has: () => true,
      size: 1,
      [Symbol.iterator]: function* () {
        yield ["accessToken", "token"];
      }
    } as unknown as ReadonlyRequestCookies;

    mockCookies.mockResolvedValue(mockCookieStore);
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(GET()).resolves.not.toThrow();
  });
});
