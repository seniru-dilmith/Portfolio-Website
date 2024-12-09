import ContentModel from "../../models/ContentModel";
import dbConnect from "../../util/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req:NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();

        if (req.method === 'GET') {
            const content = await ContentModel.find({ page: 'pricing' });
            res.status(200).json(content);
        } else {
            res.status(405).json({ message: 'Method Not Allowed' })
        }
    } catch (error) {
        if (error instanceof Error) res.status(500).json({ message: 'Internal Server Error', error: error.message });
        else res.status(500).json({ message: 'An unknown error occured' });
    }
}

export default handler;