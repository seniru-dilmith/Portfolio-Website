import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Clear the accessToken cookie
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  // Clear the refreshToken cookie
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/admin/refresh",
    maxAge: 0,
  });

  return response;
}
