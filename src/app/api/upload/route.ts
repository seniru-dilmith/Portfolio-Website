import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/util/firebaseServer';
import { verifyToken } from '@/middleware/auth';

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
    return NextResponse.json({ success: true, url });  } catch (err) {
    console.error('POST /api/upload error:', err);
    const error = err as Error;
    // Check if this is an authentication error
    if (error.message && error.message.startsWith('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    // For all other errors, return a generic error message
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
