import { NextResponse } from "next/server";
import {
  getArticles,
  createArticle,
} from "@/controllers/articleController";

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json({ success: true, data: articles }, { status: 200 });
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, tags } = await request.json();
    const article = await createArticle({ title, content, tags });
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err) {
    console.error("POST /api/articles error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
