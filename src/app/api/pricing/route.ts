import { NextResponse } from "next/server";
import dbConnect from "@/util/dbConnect";
import ContentModel from "@/models/ContentModel";

export async function GET() {
  try {
    await dbConnect();
    const pricing = await ContentModel.find({ page: "pricing" });
    return NextResponse.json(pricing, { status: 200 });
  } catch (err) {
    console.error("GET /api/pricing error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
