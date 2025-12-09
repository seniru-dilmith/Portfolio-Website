import { POST } from "@/app/api/admin/reply/route";
import WorkRequest from "@/models/WorkRequest";
import { sendEmail } from "@/lib/email";
import { getReplyEmailHtml } from "@/lib/email-templates";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/models/WorkRequest", () => ({
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("@/lib/email", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@/lib/email-templates", () => ({
  getReplyEmailHtml: jest.fn(),
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

const mockFindByIdAndUpdate = WorkRequest.findByIdAndUpdate as jest.Mock;
const mockSendEmail = sendEmail as jest.Mock;
const mockGetReplyEmailHtml = getReplyEmailHtml as jest.Mock;
const mockCookies = cookies as jest.Mock;
const mockVerify = verify as jest.Mock;
const mockNextResponse = NextResponse.json as jest.Mock;

describe("/api/admin/reply POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validBody = {
    requestId: "req_123",
    replyMessage: "Your request is accepted.",
    userName: "John Doe",
    userEmail: "john@example.com",
    originalTitle: "Project Title",
  };

  it("should return 401 if unauthorized", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const req = {} as NextRequest;

    await POST(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: "Unauthorized" },
      { status: 401 }
    );
  });

  it("should return 400 if validation fails", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });
    mockVerify.mockReturnValue({ userId: "admin" });

    const req = {
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    await POST(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid input" }),
      { status: 400 }
    );
  });

  it("should send reply and update status on success", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });
    mockVerify.mockReturnValue({ userId: "admin" });

    const req = {
      json: jest.fn().mockResolvedValue(validBody),
    } as unknown as NextRequest;

    mockFindByIdAndUpdate.mockResolvedValue({ _id: "req_123", status: "replied" });
    mockSendEmail.mockResolvedValue({ success: true });

    await POST(req);

    expect(mockSendEmail).toHaveBeenCalled();
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith("req_123", { status: "replied" });
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: true }
    );
  });

  it("should return 500 if email sending fails", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });
    mockVerify.mockReturnValue({ userId: "admin" });

    const req = {
      json: jest.fn().mockResolvedValue(validBody),
    } as unknown as NextRequest;

    mockSendEmail.mockResolvedValue({ success: false });

    await POST(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: "Failed to send email" },
      { status: 500 }
    );
  });
});
