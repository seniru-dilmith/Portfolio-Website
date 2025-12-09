"use client";

import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types/Project";
import { FaGithub, FaLink } from "react-icons/fa";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProjectCardProps {
  project: Project;
  handleEdit: (p: Project) => void;
  handleDelete: (id: string) => void;
  isAuthenticated: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project, handleEdit, handleDelete, isAuthenticated
}) => {
  const hasImages = project.imageURLs && project.imageURLs.length > 0;

  const getLinkIcon = (name: string) => {
    if (name.toLowerCase().includes('github')) {
      return <FaGithub className="mr-2 h-4 w-4" />;
    }
    return <FaLink className="mr-2 h-4 w-4" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-primary/20">
        <div className="relative h-48 bg-muted w-full">
          {hasImages ? (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {project.imageURLs.map((url, index) => (
                  <CarouselItem key={index} className="relative h-48 w-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={url}
                        alt={`${project.title} - image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {project.imageURLs.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground bg-muted/50">
              No Image
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-4 leading-relaxed">
            {project.description}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex justify-between items-center gap-4 border-t pt-4">
          <div className="flex gap-2">
            {project.links.map((link) => (
              <Button key={link.name} variant="outline" size="sm" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {getLinkIcon(link.name)}
                  {link.name}
                </a>
              </Button>
            ))}
          </div>

          {isAuthenticated && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleEdit(project)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(project._id)}>
                Delete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;