"use client";

import React from 'react';
import { ProjectListProps } from "@/types/Project";
import ProjectCard from './projectCard';
import { motion } from "framer-motion";

const ProjectList: React.FC<ProjectListProps> = ({ projects, handleEdit, handleDelete, isAuthenticated }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="text-2xl font-semibold mb-2">No Projects Found</h3>
        <p>Click &quot;Add Project&quot; to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCard
            project={project}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isAuthenticated={isAuthenticated}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectList;
