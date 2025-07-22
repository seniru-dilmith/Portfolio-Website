// Inline Swiper and Swiper CSS/module mocks
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>,
}));
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/modules", () => ({}));

import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectList from "./ProjectList";
import { Project } from "@/types/Project";
import "@testing-library/jest-dom";

// Mock ProjectCard
jest.mock("./projectCard", () => ({
  __esModule: true,
  default: ({ project }: { project: Project }) => <div data-testid="project-card">{project.title}</div>,
}));

const mockProjects: Project[] = [
  {
    _id: "1",
    title: "Project 1",
    description: "Desc 1",
    technologies: ["React"],
    links: [],
    imageURLs: [],
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Project 2",
    description: "Desc 2",
    technologies: ["TypeScript"],
    links: [],
    imageURLs: [],
    createdAt: new Date(),
  },
  {
    _id: "3",
    title: "Project 3",
    description: "Desc 3",
    technologies: ["Node.js"],
    links: [],
    imageURLs: [],
    createdAt: new Date(),
  },
];

describe("ProjectList", () => {
  it("renders 'No Projects Found' if empty", () => {
    render(
      <ProjectList
        projects={[]}
        handleEdit={jest.fn()}
        handleDelete={jest.fn()}
        isAuthenticated={false}
      />
    );
    expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    expect(screen.getByText(/add project/i)).toBeInTheDocument();
  });

  it("renders ProjectCard and empty cells for projects", () => {
    render(
      <ProjectList
        projects={mockProjects}
        handleEdit={jest.fn()}
        handleDelete={jest.fn()}
        isAuthenticated={true}
      />
    );
    // Should render 3 ProjectCard components
    expect(screen.getAllByTestId("project-card")).toHaveLength(3);
    // Should render empty cells (hidden md:block)
    expect(screen.getAllByText((content, element) => element?.className?.includes("hidden") ?? false).length).toBeGreaterThan(0);
  });
}); 