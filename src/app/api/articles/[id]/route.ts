import { NextResponse } from "next/server";
import {
  updateArticle,
  deleteArticle,
} from "@/controllers/articleController";

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { title, content, tags } = await request.json();
    const updated = await updateArticle(params.id, { title, content, tags });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error(`PUT /api/articles/${params.id} error:`, err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await deleteArticle(params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(`DELETE /api/articles/${params.id} error:`, err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
