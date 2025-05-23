import ProjectModel from '@/models/ProjectModel';
import dbConnect from '@/util/dbConnect';
import { Project } from '@/types/Project';

export const getProjects = async (): Promise<Project[]> => {
  await dbConnect();
  return ProjectModel.find();
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

// Optional helper to combine create or update based on presence of id
export const addOrUpdateProject = async (
  projectData: Partial<Project>,
  id?: string
): Promise<Project | null> => {
  await dbConnect();
  if (id) {
    return ProjectModel.findByIdAndUpdate(id, projectData, { new: true, runValidators: true });
  } else {
    return ProjectModel.create(projectData);
  }
};
