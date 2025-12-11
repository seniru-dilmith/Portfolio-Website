// Inline Swiper and Swiper CSS/module mocks
// Mock Carousel components
jest.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselNext: () => <button>Next</button>,
  CarouselPrevious: () => <button>Previous</button>,
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectCard from "./projectCard";
import { Project } from "@/types/Project";
import "@testing-library/jest-dom";

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

// Mock next/image with displayName for ESLint compliance
jest.mock("next/image", () => ({
  __esModule: true,
  default: Object.assign(({
    src,
    alt
  }: { src: string; alt: string }) => <div role="img" aria-label={alt} data-src={src} data-testid="next-image" />, { displayName: "NextImageMock" })
}));

jest.mock("react-icons/fa", () => ({
  FaGithub: () => <span data-testid="fa-github">GitHubIcon</span>,
  FaLink: () => <span data-testid="fa-link">LinkIcon</span>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    if (asChild) return <>{children}</>;
    return <button {...props}>{children}</button>;
  },
}));

const mockProject: Project = {
  _id: "1",
  title: "Test Project",
  description: "A test project description",
  technologies: ["React", "TypeScript"],
  links: [
    { name: "GitHub", url: "https://github.com" },
    { name: "Demo", url: "https://demo.com" },
  ],
  imageURLs: ["/img1.png", "/img2.png"],
  createdAt: new Date(),
};

describe("ProjectCard", () => {
  it("renders project details and images", () => {
    render(
      <ProjectCard
        project={mockProject}
        handleEdit={jest.fn()}
        handleDelete={jest.fn()}
        isAuthenticated={false}
      />
    );
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A test project description")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Demo/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("next-image")).toHaveLength(2);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("renders edit and delete buttons if authenticated", () => {
    render(
      <ProjectCard
        project={mockProject}
        handleEdit={jest.fn()}
        handleDelete={jest.fn()}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls handleEdit and handleDelete when buttons are clicked", () => {
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();
    render(
      <ProjectCard
        project={mockProject}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isAuthenticated={true}
      />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(handleEdit).toHaveBeenCalledWith(mockProject);
    fireEvent.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalledWith(mockProject._id);
  });

  it("renders 'No Image' if no images are present", () => {
    const projectNoImages = { ...mockProject, imageURLs: [] };
    render(
      <ProjectCard
        project={projectNoImages}
        handleEdit={jest.fn()}
        handleDelete={jest.fn()}
        isAuthenticated={false}
      />
    );
    expect(screen.getByText(/no image/i)).toBeInTheDocument();
  });
}); 