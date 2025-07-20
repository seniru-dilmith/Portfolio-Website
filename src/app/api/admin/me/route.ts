import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_ACCESS_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.NEXT_JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.NEXT_JWT_ACCESS_EXPIRY!;
const REFRESH_TOKEN_EXPIRY = process.env.NEXT_JWT_REFRESH_EXPIRY!;

export async function GET(request: NextRequest) {
  try {
    // Try to get access token from cookies (server) or headers (client fetch)
    let accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken && request.headers.get("authorization")) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        accessToken = authHeader.slice(7);
      }
    }
    if (!accessToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    try {
      jwt.verify(accessToken, JWT_ACCESS_SECRET);
      return NextResponse.json({ message: "Authenticated" }, { status: 200 });
    } catch (err: unknown) {
      // Type-narrowing for error
      if (err && typeof err === "object" && "name" in err && (err as { name?: string }).name === "TokenExpiredError") {
      // If token expired, try to refresh
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
          // Optionally, refresh the refresh token as well
          const newRefreshToken = jwt.sign(
            { id: payload.id },
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
          );
          const response = NextResponse.json({ message: "Authenticated (refreshed)" }, { status: 200 });
          response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: parseExpiryToSeconds(ACCESS_TOKEN_EXPIRY),
            path: "/",
          });
          response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY),
            path: "/",
          });
          return response;
// Helper to parse expiry string like '7d', '15m' to seconds
function parseExpiryToSeconds(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 60 * 60 * 24 * 7; // default 7 days
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: return value;
  }
}
        } catch {
          return NextResponse.json({ message: "Session expired" }, { status: 401 });
        }
      }
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
