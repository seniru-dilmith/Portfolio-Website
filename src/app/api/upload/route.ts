import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const articleId = formData.get("articleId") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!articleId) {
            return NextResponse.json({ error: "No article ID provided" }, { status: 400 });
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
        // Method 1: Signed URL (Time limited) - Not ideal for articles
        // Method 2: Public URL (Persistent)
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
