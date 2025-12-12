import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "@/middleware/auth";

export async function POST(req: NextRequest) {
    try {
        await verifyToken(req);

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const articleId = formData.get("articleId") as string;

        if (!file) {
            return NextResponse.json({ success: false, message: "No files received." }, { status: 400 });
        }

        if (!articleId) {
            return NextResponse.json({ success: false, message: "Project ID is required." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `articles/${articleId}/${uuidv4()}.jpg`;
        const fileRef = bucket.file(filename);

        await fileRef.save(buffer, {
            metadata: {
                contentType: file.type || "image/jpeg",
            },
        });

        // Make the file public (optional, depending on your security model, but typically needed for public articles)
        await fileRef.makePublic();

        // Construct the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        return NextResponse.json({ success: true, urls: [publicUrl] }, { status: 200 });

    } catch (error: unknown) {
        console.error("Upload failed:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const message = error instanceof Error ? error.message : "Upload failed";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}
