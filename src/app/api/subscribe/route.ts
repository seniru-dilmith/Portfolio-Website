import { NextResponse } from "next/server";
import dbConnect from "@/util/dbConnect";
import MailSubscriber from "@/models/MailSubscriberModel";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email } = (await request.json()) as { email?: string };
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    const exists = await MailSubscriber.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email is already subscribed" },
        { status: 400 }
      );
    }

    await MailSubscriber.create({ email });
    return NextResponse.json(
      { success: true, message: "Subscription successful" },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/subscribe error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown";
    return NextResponse.json(
      { success: false, message: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Optionally, handle other methods:
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 }
  );
}
