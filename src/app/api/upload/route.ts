import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/firebaseAdmin';
import { verifyToken } from '@/middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    await verifyToken(request);

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const projectId = formData.get('projectId') as string;

    if (!files.length) {
      return NextResponse.json({ success: false, message: 'No files received.' }, { status: 400 });
    }
    if (!projectId) {
      return NextResponse.json({ success: false, message: 'Project ID is required.' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Create a unique filename to prevent overwrites
      const uniqueFilename = `${Date.now()}-${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = `projects/${projectId}/${uniqueFilename}`;
      
      const fileUpload = bucket.file(filePath);

      await fileUpload.save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

      // Make the file public and get its URL
      await fileUpload.makePublic();
      urls.push(fileUpload.publicUrl());
    }

    return NextResponse.json({ success: true, urls: urls }, { status: 200 });

  } catch (err) {
    console.error('Upload API error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith('Unauthorized') ? 401 : 500 }
    );
  }
}
