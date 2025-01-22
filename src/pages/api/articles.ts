import { NextApiRequest, NextApiResponse } from 'next';
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/controllers/articleController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const articles = await getArticles();
            return res.status(200).json({ success: true, data: articles });
        }

        if (req.method === 'POST') {
            const { title, content, tags } = req.body;
            const article = await createArticle({ title, content, tags });
            return res.status(201).json({ success: true, data: article });
        }

        if (req.method === 'PUT') {
            const { id } = req.query;
            const { title, content, tags } = req.body;
            const article = await updateArticle(id as string, { title, content, tags });
            return res.status(200).json({ success: true, data: article });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            await deleteArticle(id as string);
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
