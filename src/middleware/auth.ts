import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;

export async function verifyToken(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch {
    throw new Error("Unauthorized: Invalid token");
  }
}
