import dbConnect from '../../../util/dbConnect';
import Project from '../../../models/ProjectModel';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_JWT_SECRET || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  const verifyToken = () => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized! No token provided!');      
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unauthorized! Invalid Token! ${error.message}`);
      } else {
        throw new Error('Unauthorized! Invalid Token!');
      }
    }
  }

  switch (req.method) {
    case 'PUT':
      try {
        verifyToken();
        const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
        if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ success: false, message: error.message });
        }
      }
      break;

    case 'DELETE':
      try {
        verifyToken();
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: deletedProject });
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
