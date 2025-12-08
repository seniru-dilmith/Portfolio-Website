import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';
import { WorkRequest } from '@/types/request';

const requestSchema = z.object({
  email: z.string().email(),
  title: z.string().min(3),
  description: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
    }

    const { email, title, description } = result.data;

    // Check for duplicate pending requests
    const snapshot = await db.collection('work_requests')
      .where('email', '==', email)
      .where('title', '==', title)
      .where('status', '==', 'pending')
      .get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: 'A pending request with this title already exists for this email.' },
        { status: 409 }
      );
    }

    const newRequest: Omit<WorkRequest, 'id'> = {
      email,
      title,
      description,
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await db.collection('work_requests').add(newRequest);

    // Send confirmation email
    await sendEmail(
      email,
      `Request Received: ${title}`,
      `<p>Hi there,</p>
       <p>Thanks for reaching out! I've received your request titled "<strong>${title}</strong>".</p>
       <p>I'll review it and get back to you shortly.</p>
       <br>
       <p>Best regards,</p>
       <p>${process.env.NEXT_PUBLIC_SITE_NAME || 'Seniru Dilmith'}</p>`
    );

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error processing work request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
