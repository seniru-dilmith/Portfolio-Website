import { POST } from "@/app/api/subscribe/route";
import dbConnect from "@/util/dbConnect";
import MailSubscriber from "@/models/MailSubscriberModel";
import { NextResponse } from "next/server";

// Mock Request
global.Request = jest.fn().mockImplementation((url) => ({
  url,
  json: jest.fn(),
}));

jest.mock("@/util/dbConnect", () => jest.fn());
jest.mock("@/models/MailSubscriberModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockMailSubscriber = MailSubscriber as jest.Mocked<typeof MailSubscriber>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("/api/subscribe - POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("subscribes new email successfully", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: "test@example.com" })
    } as unknown as Request;

    mockMailSubscriber.findOne.mockResolvedValue(null);
    mockMailSubscriber.create.mockResolvedValue({});

    await POST(mockRequest);

    expect(mockDbConnect).toHaveBeenCalled();
    expect(mockMailSubscriber.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockMailSubscriber.create).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: true, message: "Subscription successful" },
      { status: 201 }
    );
  });

  it("returns 400 for invalid email", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: "invalid-email" })
    } as unknown as Request;

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Invalid email address" },
      { status: 400 }
    );
    expect(mockMailSubscriber.findOne).not.toHaveBeenCalled();
  });

  it("returns 400 for missing email", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({})
    } as unknown as Request;

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Invalid email address" },
      { status: 400 }
    );
  });

  it("returns 400 for already subscribed email", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: "test@example.com" })
    } as unknown as Request;

    mockMailSubscriber.findOne.mockResolvedValue({ email: "test@example.com" });

    await POST(mockRequest);

    expect(mockMailSubscriber.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Email is already subscribed" },
      { status: 400 }
    );
    expect(mockMailSubscriber.create).not.toHaveBeenCalled();
  });

  it("handles database errors", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: "test@example.com" })
    } as unknown as Request;

    mockMailSubscriber.findOne.mockRejectedValue(new Error("Database error"));

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { success: false, message: "Server error: Database error" },
      { status: 500 }
    );
  });

  it("validates email format correctly", async () => {
    const invalidEmails = ["", "test", "test@", "@example.com", "test@.com"];
    
    for (const email of invalidEmails) {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ email })
      } as unknown as Request;

      await POST(mockRequest);

      expect(mockNextResponse).toHaveBeenCalledWith(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }
  });
});
