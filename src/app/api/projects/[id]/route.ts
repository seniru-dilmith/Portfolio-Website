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

// `params.id` is your dynamic segment
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    await verifyToken(request);
    const body = await request.json();
    const updated = await Project.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: errorMessage.startsWith("Unauthorized") ? 401 : 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    // you can choose to verifyToken here too
    await verifyToken(_request);
    const deleted = await Project.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: errorMessage.startsWith("Unauthorized") ? 401 : 400 }
    );
  }
}
