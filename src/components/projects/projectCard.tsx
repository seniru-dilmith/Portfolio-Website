import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types/Project";
import { FaGithub, FaLink } from "react-icons/fa";

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Individual Project Card with Swiper Carousel
const ProjectCard: React.FC<{ project: Project; handleEdit: (p: Project) => void; handleDelete: (id: string) => void; isAuthenticated: boolean }> = ({
  project, handleEdit, handleDelete, isAuthenticated
}) => {
  const hasImages = project.imageURLs && project.imageURLs.length > 0;

  const getLinkIcon = (name: string) => {
    if (name.toLowerCase().includes('github')) {
      return <FaGithub />;
    }
    return <FaLink />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card bg-base-100 text-base-content shadow-xl flex flex-col overflow-hidden" // Added overflow-hidden
    >
      {/* The entire carousel is now managed by Swiper */}
      <figure className="relative h-48 bg-base-300 group">
        {hasImages ? (
          <Swiper
            // Install navigation module
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            navigation // Enables the navigation arrows
            loop={true} // Allows infinite scrolling
            className="w-full h-full"
          >
            {project.imageURLs.map((url, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={url}
                  alt={`${project.title} - slide ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={80}
                  priority={index === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
        )}
      </figure>

      <div className="card-body p-5 flex-grow flex flex-col">
        <h2 className="card-title text-xl font-bold">{project.title}</h2>
        <p className="text-gray-500 text-sm mt-1 line-clamp-3 flex-grow">{project.description}</p>
        <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Technologies:</p>
            <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                    <div key={tech} className="badge badge-outline">{tech}</div>
                ))}
            </div>
        </div>
        <div className="card-actions justify-between items-center mt-5">
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm gap-2"
              >
                {getLinkIcon(link.name)} {link.name}
              </a>
            ))}
          </div>
          {isAuthenticated && (
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(project)} className="btn btn-warning btn-sm">Edit</button>
              <button onClick={() => handleDelete(project._id)} className="btn btn-error btn-sm">Delete</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;