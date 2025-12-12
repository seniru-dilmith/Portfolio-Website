import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.NEXT_JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.NEXT_JWT_ACCESS_EXPIRY!;
const REFRESH_TOKEN_EXPIRY = process.env.NEXT_JWT_REFRESH_EXPIRY!;

// convert expiry time string to seconds
import { parseExpiryToSeconds } from "@/lib/utils";


export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };

    // Issue new access token
    const newAccessToken = jwt.sign(
      { id: payload.id },
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Issue a new refresh token (good practice for security)
    const newRefreshToken = jwt.sign(
      { id: payload.id },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    const response = NextResponse.json({ message: "Token refreshed successfully" }, { status: 200 });

    // Set the new tokens with the correct global path
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: "strict",
      maxAge: parseExpiryToSeconds(ACCESS_TOKEN_EXPIRY),
      path: "/",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: "strict",
      maxAge: parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY),
      path: "/",
    });
    
    return response;

  } catch {
    // if refresh token is invalid or expired
    const response = NextResponse.json({ message: "Session expired" }, { status: 401 });
    // clear the invalid cookies from the browser
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }
}
