import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/util/firebaseServer';

const JWT_SECRET = process.env.NEXT_JWT_SECRET!;

async function verifyToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error('Unauthorized: Invalid token');
  }
}

export async function POST(request: Request) {
  try {
    await verifyToken(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const storageRef = ref(storage, `project-images/${file.name}`);
    await uploadBytes(storageRef, bytes);
    const url = await getDownloadURL(storageRef);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('POST /api/upload error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith('Unauthorized') ? 401 : 500 }
    );
  }
}
