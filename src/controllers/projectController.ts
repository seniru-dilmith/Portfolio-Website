import ProjectModel from '@/models/ProjectModel';
import dbConnect from '@/util/dbConnect';
import { Project } from '@/types/Project';

export const getProjects = async (): Promise<Project[]> => {
  await dbConnect();
  return ProjectModel.find().sort({ createdAt: -1 });
};

export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  await dbConnect();
  return ProjectModel.create(projectData);
};

export const updateProject = async (
  id: string,
  projectData: Partial<Project>
): Promise<Project | null> => {
  await dbConnect();
  return ProjectModel.findByIdAndUpdate(id, projectData, { new: true, runValidators: true });
};

export const deleteProject = async (id: string): Promise<Project | null> => {
  await dbConnect();
  return ProjectModel.findByIdAndDelete(id);
};
