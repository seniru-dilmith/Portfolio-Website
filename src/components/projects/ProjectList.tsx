import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/types/Project';

interface ProjectListProps {
  projects: Project[];
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  isAuthenticated: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, handleEdit, handleDelete, isAuthenticated }) => {
  const [visibleRows, setVisibleRows] = useState<number>(1); // Number of visible rows
  const [gridData, setGridData] = useState<(Project | null)[][]>([]); // 2D grid of projects and blank cells
  const ROWS_PER_LOAD = 1; // Number of rows to load/unload per scroll

  useEffect(() => {
    // Create a 2D grid with alternating projects and blank cells
    const grid: (Project | null)[][] = [];
    let currentRow: (Project | null)[] = [];

    projects.forEach((project, index) => {
      currentRow.push(project);
      currentRow.push(null); // Add a blank cell

      // Break into a new row after every 3 cells
      if (currentRow.length >= 3) {
        grid.push(currentRow);
        currentRow = [];
      }
    });

    // Add the last row if not complete
    if (currentRow.length > 0) grid.push(currentRow);

    setGridData(grid);
  }, [projects]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        if (window.innerHeight + currentScrollY >= document.body.offsetHeight - 500) {
          setVisibleRows((prev) => Math.min(prev + ROWS_PER_LOAD, gridData.length));
        }
      } else {
        // Scrolling up
        if (currentScrollY < lastScrollY - 50) {
          setVisibleRows((prev) => Math.max(prev - ROWS_PER_LOAD, 1));
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [gridData.length]);

  // Variants for animations with delay based on index
  const cardVariants = (index: number) => ({
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut', delay: index * 0.2 },
    },
    hover: { scale: 1.1, rotate: 1, boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)' },
  });

  const emptyCellVariants = (_index: number) => ({
    visible: {
      opacity: 0,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8 min-h-screen">
      {gridData.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {rowIndex < visibleRows && // Only render visible rows
            row.map((item, index) => {
              const globalIndex = rowIndex * 3 + index; // Global index for delay calculation

              if (!item) {
                // Render blank cell with hover animation
                return (
                  <motion.div
                    key={`empty-${rowIndex}-${index}`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover="hover"
                    variants={emptyCellVariants(globalIndex)}
                    className="h-40 bg-gray-200 rounded-lg shadow-md"
                  />
                );
              }

              return (
                <motion.div
                  key={item._id}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  variants={cardVariants(globalIndex)}
                  className="card bg-base-100 shadow-xl p-4 rounded-lg"
                >
                  {item.imageURL && (
                    <motion.div
                      className="overflow-hidden rounded-lg mb-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image
                        src={item.imageURL}
                        alt={item.title}
                        width={300}
                        height={160}
                        className="object-cover w-full h-2/3"
                        quality={75}
                      />
                    </motion.div>
                  )}
                  <h2 className="card-title text-lg font-bold text-center">{item.title}</h2>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-3">{item.description}</p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">Technologies:</span> {item.technologies.join(', ')}
                  </p>
                  <motion.a
                    href={item.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm mt-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    GitHub
                  </motion.a>
                  {isAuthenticated && (
                    <div className="flex justify-between mt-4">
                      <motion.button
                        onClick={() => handleEdit(item)}
                        className="btn btn-warning btn-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-error btn-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProjectList;
