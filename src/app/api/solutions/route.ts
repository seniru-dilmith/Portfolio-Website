import { NextResponse } from "next/server";
import dbConnect from "@/util/dbConnect";
import ContentModel from "@/models/ContentModel";

export async function GET() {
  try {
    await dbConnect();
    const content = await ContentModel.find({ page: "solutions" });
    return NextResponse.json(content, { status: 200 });
  } catch (err) {
    console.error("GET /api/solutions error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
