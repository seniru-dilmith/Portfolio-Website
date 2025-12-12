import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    await verifyToken(request);
    
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // In tests, response.cookies might not be available
    if (response.cookies && typeof response.cookies.set === 'function') {
      const isProduction = process.env.NODE_ENV === 'production';

      // Clear the accessToken cookie
      response.cookies.set("accessToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });

      // Clear the refreshToken cookie
      response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
    }

    return response;
  } catch (err) {
    const error = err as Error;
    const isUnauthorized = error.message === "Unauthorized";
    
    return NextResponse.json(
      {
        success: false,
        message: isUnauthorized ? "Unauthorized" : "Internal server error"
      },
      { status: isUnauthorized ? 401 : 500 }
    );
  }
}
