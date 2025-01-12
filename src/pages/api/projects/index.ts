import dbConnect from '../../../util/dbConnect';
import Project from '../../../models/ProjectModel';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_JWT_SECRET || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const verifyToken = () => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract token
    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Verify token
      return decoded; // Return the decoded token payload
    } catch (error) {
      throw new Error('Unauthorized: Invalid token');
    }
  };

  switch (req.method) {
    case 'POST':
      try {
        verifyToken();
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ success: false, message: error.message });
        }
      }
      break;

    case 'GET':
      try {
        const projects = await Project.find({});
        res.status(200).json({ success: true, data: projects });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ success: false, message: error.message });
        }
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
