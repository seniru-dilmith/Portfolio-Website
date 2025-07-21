import React from 'react';
import { ProjectListProps } from "@/types/Project";

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import ProjectCard from './projectCard';

// Main List Component
const ProjectList: React.FC<ProjectListProps> = ({ projects, handleEdit, handleDelete, isAuthenticated }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <h3 className="text-2xl font-semibold">No Projects Found</h3>
        <p>Click &quot;Add Project&quot; to get started.</p>
      </div>
    );
  }

  // CORRECTED: The EmptyCell component does not receive 'key' as a prop.
  // React uses the key on the component instance itself.
  const EmptyCell = () => (
    <div className="hidden md:block" aria-hidden="true" />
  );

  // Generate the grid cells with projects and placeholders on every render
  const gridCells: React.ReactNode[] = [];
  let projectIndex = 0;

  while (projectIndex < projects.length) {
    // Row 1: x o x
    gridCells.push(
      <ProjectCard 
        key={projects[projectIndex]._id}
        project={projects[projectIndex]} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
        isAuthenticated={isAuthenticated} 
      />
    );
    projectIndex++;

    gridCells.push(<EmptyCell key={`empty-${gridCells.length}`} />);

    if (projectIndex < projects.length) {
      gridCells.push(
        <ProjectCard 
          key={projects[projectIndex]._id}
          project={projects[projectIndex]} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          isAuthenticated={isAuthenticated} 
        />
      );
      projectIndex++;
    } else {
      gridCells.push(<EmptyCell key={`empty-${gridCells.length}`} />);
    }

    // Row 2: o x o
    if (projectIndex < projects.length) {
      gridCells.push(<EmptyCell key={`empty-${gridCells.length}`} />);
      
      gridCells.push(
        <ProjectCard 
          key={projects[projectIndex]._id}
          project={projects[projectIndex]} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          isAuthenticated={isAuthenticated} 
        />
      );
      projectIndex++;
      
      gridCells.push(<EmptyCell key={`empty-${gridCells.length}`} />);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-3">
      {gridCells}
    </div>
  );
};

export default ProjectList;
