import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_REFRESH_SECRET = process.env.NEXT_JWT_REFRESH_SECRET!;
const JWT_ACCESS_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;
const ACCESS_TOKEN_EXPIRY = "15m";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token provided" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };

    // Generate new access token
    const accessToken = jwt.sign(
      { id: payload.id },
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const response = NextResponse.json(
      { success: true, message: "Token refreshed" },
      { status: 200 }
    );
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Refresh token error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
