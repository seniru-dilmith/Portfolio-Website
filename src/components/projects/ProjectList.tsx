import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project, ProjectListProps } from "@/types/Project";

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  handleEdit,
  handleDelete,
  isAuthenticated,
}) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const LOAD_COUNT = 3;

  useEffect(() => {
    setVisibleCount(Math.min(LOAD_COUNT, projects.length));
  }, [projects.length]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setVisibleCount((prev) => Math.min(prev + LOAD_COUNT, projects.length));
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [projects.length]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    hover: { scale: 1.1, rotate: 1, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-3 min-h-screen">
      {projects.slice(0, visibleCount).map((item) => (
        <motion.div
          key={item._id}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileHover="hover"
          variants={cardVariants}
          className="card bg-base-100 text-base-content shadow-xl p-4 rounded-lg"
        >
          {item.imageURL && (
            <motion.div className="overflow-hidden rounded-lg mb-4" whileHover={{ scale: 1.05 }}>
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
            <span className="font-semibold">Technologies:</span> {item.technologies.join(", ")}
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
              <motion.button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm" whileHover={{ scale: 1.1 }}>
                Edit
              </motion.button>
              <motion.button onClick={() => handleDelete(item._id)} className="btn btn-error btn-sm" whileHover={{ scale: 1.1 }}>
                Delete
              </motion.button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectList;
