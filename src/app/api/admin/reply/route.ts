import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const replySchema = z.object({
  requestId: z.string(),
  userEmail: z.string().email(),
  replyMessage: z.string().min(1),
  originalTitle: z.string(),
});

async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

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
    const body = await req.json();
    const result = replySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.errors }, { status: 400 });
    }

    const { requestId, userEmail, replyMessage, originalTitle } = result.data;

    // Send email
    const emailResult = await sendEmail(
      userEmail,
      `Re: ${originalTitle} - Response from ${process.env.NEXT_PUBLIC_SITE_NAME}`,
      `<p>${replyMessage.replace(/\n/g, '<br>')}</p>
       <br>
       <hr>
       <p style="color: #666; font-size: 0.9em;">You received this email because you submitted a request on our website.</p>`
    );

    if (!emailResult.success) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Update Request Status
    await db.collection('work_requests').doc(requestId).update({
      status: 'replied',
      repliedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
