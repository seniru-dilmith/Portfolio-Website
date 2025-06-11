import { NextRequest, NextResponse } from 'next/server';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/controllers/projectController';
import { verifyToken } from '@/middleware/auth';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (err) {
    console.error('GET /api/projects error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

export async function PUT(request: NextRequest) {
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

export async function DELETE(request: NextRequest) {
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
    // Return only the ID in the response to match the test expectations
    return NextResponse.json({ success: true, data: { _id: id } });
  } catch (err) {
    console.error('DELETE /api/projects error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: message.startsWith('Unauthorized') ? 401 : 500 }
    );
  }
}
