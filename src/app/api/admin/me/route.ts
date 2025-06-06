import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;

export async function GET() {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    jwt.verify(accessToken, JWT_ACCESS_SECRET);
    return NextResponse.json({ message: "Authenticated" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
