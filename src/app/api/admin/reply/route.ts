import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/util/dbConnect';
import WorkRequest from '@/models/WorkRequest';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';
import { getReplyEmailHtml } from '@/lib/email-templates';

const JWT_SECRET = process.env.NEXT_JWT_ACCESS_SECRET!;

const replySchema = z.object({
  requestId: z.string(),
  userEmail: z.string().email(),
  userName: z.string(),
  replyMessage: z.string().min(1),
  originalTitle: z.string(),
});

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

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const result = replySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
    }

    const { requestId, userEmail, userName, replyMessage, originalTitle } = result.data;

    // Send email
    const emailResult = await sendEmail(
      userEmail,
      `Re: ${originalTitle} - Response from ${process.env.NEXT_PUBLIC_SITE_NAME || 'Seniru Dilmith'}`,
      getReplyEmailHtml(userName, replyMessage, originalTitle)
    );

    if (!emailResult.success) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Update Request Status
    await WorkRequest.findByIdAndUpdate(requestId, {
      status: 'replied',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
