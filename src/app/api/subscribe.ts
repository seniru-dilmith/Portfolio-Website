import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/util/dbConnect';
import MailSubscriber from '@/models/MailSubscriberModel';

// Define response types for better type safety
type ApiResponse = {
    success: boolean;
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>): Promise<void> {
    try {
        // Establish database connection
        await dbConnect();

        switch (req.method) {
            case 'POST': {
                // Validate email from the request body
                const { email } = req.body as { email?: string };

                if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid email address',
                    });
                }

                // Check if the email already exists
                const existingSubscriber = await MailSubscriber.findOne({ email });
                if (existingSubscriber) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email is already subscribed',
                    });
                }

                // Add the new subscriber
                await MailSubscriber.create({ email });

                return res.status(201).json({
                    success: true,
                    message: 'Subscription successful',
                });
            }

            default: {
                return res.status(405).json({
                    success: false,
                    message: 'Method not allowed',
                });
            }
        }
    } catch (error) {
        // Handle any unexpected server errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            message: `Server error: ${errorMessage}`,
        });
    }
}
