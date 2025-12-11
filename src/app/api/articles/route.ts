import { NextRequest, NextResponse } from "next/server";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/controllers/articleController";
import { verifyToken } from "@/middleware/auth";
import { stripMarkdown } from "@/lib/markdown";

export async function GET() {
  try {
    const articles = await getArticles();
    
    // Process articles to strip markdown for preview on the server side
    // avoiding main-thread blocking on the client
    const processedArticles = [];
    // Limit to recent 20 articles to prevent rendering bottleneck
    const recentArticles = articles.reverse().slice(0, 20); 
    
    for (const article of recentArticles) {
      const articleObj = article.toObject ? article.toObject() : article;
      const plainText = await stripMarkdown(articleObj.content || "");
      // Truncate to 300 chars to reduce payload size and JSON parse time on client
      processedArticles.push({ ...articleObj, content: plainText.slice(0, 300) });
    }

    return NextResponse.json({ success: true, data: processedArticles }, { status: 200 });
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyToken(request);
    const { title, content, tags, author, createdAt } = await request.json();
    const article = await createArticle({ title, content, tags, author, createdAt });
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err) {
    console.error("POST /api/articles error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id query param" }, { status: 400 });
    }
    const { title, content, tags, author, createdAt } = await request.json();
    const updated = await updateArticle(id, { title, content, tags, author, createdAt });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/articles error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {  try {
    await verifyToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id query param" }, { status: 400 });
    }
    await deleteArticle(id);
    return NextResponse.json({ success: true, message: "Article deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/articles error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith("Unauthorized") ? 401 : 500 }
    );
  }
}
