import { NextResponse } from "next/server";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/controllers/articleController";

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json({ success: true, data: articles }, { status: 200 });
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, tags } = await request.json();
    const article = await createArticle({ title, content, tags });
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err) {
    console.error("POST /api/articles error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id query param" }, { status: 400 });
    }
    const { title, content, tags } = await request.json();
    const updated = await updateArticle(id, { title, content, tags });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/articles error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id query param" }, { status: 400 });
    }
    await deleteArticle(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/articles error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
