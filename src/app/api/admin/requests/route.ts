import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/util/dbConnect';
import WorkRequest from '@/models/WorkRequest';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;

async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

  if (!token) return false;

  try {
    verify(token.value, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const requests = await WorkRequest.find({}).sort({ createdAt: -1 });

    interface WorkRequestDoc {
      _id: { toString: () => string };
      name?: string;
      email: string;
      title?: string;
      description: string;
      status: string;
      createdAt: Date;
    }
    const formattedRequests = (requests as unknown as WorkRequestDoc[]).map((doc) => ({
      id: doc._id.toString(),
      name: doc.name || 'Unknown', // Handle legacy data
      email: doc.email,
      title: doc.title,
      description: doc.description,
      status: doc.status,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
