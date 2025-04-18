import { NextResponse } from "next/server";
import dbConnect from "@/util/dbConnect";
import ContentModel from "@/models/ContentModel";

export async function GET() {
  try {
    await dbConnect();

    const features = await ContentModel.find({ page: "features" });
    return NextResponse.json(features, { status: 200 });
  } catch (err) {
    console.error("GET /api/features error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
