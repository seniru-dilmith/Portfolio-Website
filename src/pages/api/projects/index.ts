import dbConnect from '../../../util/dbConnect';
import Project from '../../../models/ProjectModel';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
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
