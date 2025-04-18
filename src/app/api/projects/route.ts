import { NextResponse } from "next/server";
import dbConnect from "@/util/dbConnect";
import Project from "@/models/ProjectModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_JWT_SECRET!;

async function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error("Unauthorized: Invalid token");
  }
}

export async function GET() {
  await dbConnect();
  const projects = await Project.find({});
  return NextResponse.json({ success: true, data: projects });
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    await verifyToken(request);
    const body = await request.json();
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || "Bad request" },
      { status: error.message.startsWith("Unauthorized") ? 401 : 400 }
    );
  }
}
