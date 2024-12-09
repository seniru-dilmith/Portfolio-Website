import dbConnect from '../../util/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    res.status(200).json({ success: true, message: 'Database connected!' });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ success: false, message: error.message });
  }
}
