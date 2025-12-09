import { POST } from "@/app/api/work-with-me/route";
import WorkRequest from "@/models/WorkRequest";
import { sendEmail } from "@/lib/email";
import { getConfirmationEmailHtml } from "@/lib/email-templates";
import { NextRequest, NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/models/WorkRequest", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("@/lib/email", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@/lib/email-templates", () => ({
  getConfirmationEmailHtml: jest.fn(),
}));

jest.mock("@/util/dbConnect", () => jest.fn());

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockFindOne = WorkRequest.findOne as jest.Mock;
const mockCreate = WorkRequest.create as jest.Mock;
const mockSendEmail = sendEmail as jest.Mock;
const mockGetConfirmationEmailHtml = getConfirmationEmailHtml as jest.Mock;
const mockNextResponse = NextResponse.json as jest.Mock;

describe("/api/work-with-me POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validBody = {
    name: "John Doe",
    email: "john@example.com",
    title: "Project Title",
    description: "Project Description that is long enough to pass validation rules.",
  };

  it("should return 400 if validation fails", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    await POST(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid input" }),
      { status: 400 }
    );
  });

  it("should return 409 if duplicate exists", async () => {
    const req = {
      json: jest.fn().mockResolvedValue(validBody),
    } as unknown as NextRequest;

    mockFindOne.mockResolvedValue({ _id: "existing_id" });

    await POST(req);

    expect(mockFindOne).toHaveBeenCalledWith({ 
        email: validBody.email, 
        title: validBody.title, 
        status: 'pending' 
    });
    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: "A pending request with this title already exists for this email." },
      { status: 409 }
    );
  });

  it("should create a request and send email on success", async () => {
    const req = {
      json: jest.fn().mockResolvedValue(validBody),
    } as unknown as NextRequest;

    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ _id: "new_id", ...validBody });
    mockSendEmail.mockResolvedValue(true);
    mockGetConfirmationEmailHtml.mockReturnValue("<html>Confirmation</html>");

    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining(validBody));
    expect(mockSendEmail).toHaveBeenCalled();
    expect(mockNextResponse).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, id: "new_id" }),
      { status: 201 }
    );
  });

  it("should return 500 on server error", async () => {
    const req = {
      json: jest.fn().mockResolvedValue(validBody),
    } as unknown as NextRequest;

    mockFindOne.mockRejectedValue(new Error("DB Error"));

    await POST(req);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
});
