import { NextResponse } from 'next/server';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/controllers/projectController';
import jwt from 'jsonwebtoken';

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

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (err) {
    console.error('GET /api/projects error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await verifyToken(request);
    const body = await request.json();
    const project = await createProject(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (err) {
    console.error('POST /api/projects error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await verifyToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id query param' }, { status: 400 });
    }
    const body = await request.json();
    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('PUT /api/projects error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await verifyToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id query param' }, { status: 400 });
    }
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    console.error('DELETE /api/projects error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith('Unauthorized') ? 401 : 500 }
    );
  }
}
