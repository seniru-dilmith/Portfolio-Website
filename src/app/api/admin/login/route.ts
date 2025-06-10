import { NextResponse } from "next/server";
import dbConnect from "@/util/dbConnect";
import User from "@/models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_ACCESS_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.NEXT_JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.NEXT_JWT_ACCESS_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.NEXT_JWT_REFRESH_EXPIRY;

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Both email and password are required." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid username" },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY } as jwt.SignOptions
    );
    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY } as jwt.SignOptions
    );

    // TODO: Optionally save refreshToken in DB/Redis for revocation or tracking

    // Set cookies
    const response = NextResponse.json(
      { success: true, message: "Login Successful" },
      { status: 200 }
    );
    // HttpOnly, Secure, SameSite cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/admin/refresh", // only send refresh token on refresh API route
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
