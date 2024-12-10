import React from 'react';
import { Project } from '@/types/Project';

interface ProjectListProps {
  projects: Project[];
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  isAuthenticated: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, handleEdit, handleDelete, isAuthenticated }) => {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project._id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <p>{project.description}</p>
          <p className="text-sm text-gray-500">Technologies: {project.technologies.join(', ')}</p>
          <a
            href={project.githubURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            GitHub
          </a>
          {isAuthenticated && <div className="mt-4">
            <button
              onClick={() => handleEdit(project)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(project._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>}
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
