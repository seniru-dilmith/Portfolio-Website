import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/util/dbConnect';
import WorkRequest from '@/models/WorkRequest';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';
import { getConfirmationEmailHtml } from '@/lib/email-templates';

const requestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  title: z.string().min(3),
  description: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
    }

    const { name, email, title, description } = result.data;

    // Check for duplicate pending requests
    const existingRequest = await WorkRequest.findOne({
      email,
      title,
      status: 'pending',
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A pending request with this title already exists for this email.' },
        { status: 409 }
      );
    }

    const newRequest = await WorkRequest.create({
      name,
      email,
      title,
      description,
      status: 'pending',
    });

    // Send confirmation email
    await sendEmail(
      email,
      `Request Received: ${title}`,
      getConfirmationEmailHtml(name, title)
    );

    return NextResponse.json({ success: true, id: newRequest._id }, { status: 201 });
  } catch (error) {
    console.error('Error processing work request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
