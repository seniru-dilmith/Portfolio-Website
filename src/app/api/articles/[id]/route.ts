import { NextResponse } from "next/server";
import { getArticleById } from "@/controllers/articleController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: article }, { status: 200 });
  } catch (err) {
    console.error("GET /api/articles/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
