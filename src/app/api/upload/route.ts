import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/util/firebaseServer';

const JWT_ACCESS_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch {
    throw new Error('Unauthorized: Invalid token');
  }
}

export async function POST(request: NextRequest) {
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
