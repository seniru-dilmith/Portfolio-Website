import dbConnect from '../../../util/dbConnect';
import Project from '../../../models/ProjectModel';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'PUT':
      try {
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
