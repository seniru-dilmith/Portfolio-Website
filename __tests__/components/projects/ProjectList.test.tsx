import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectList from "@/components/projects/ProjectList";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
    a: ({ children, className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    ),
    button: ({ children, className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
}));

// Mock next/image
jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockProjects = [
  {
    _id: "1",
    title: "Test Project 1",
    description: "A test project description",
    technologies: ["React", "TypeScript"],
    githubURL: "https://github.com/test/project1",
    imageURL: "/test-image.jpg",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "2", 
    title: "Test Project 2",
    description: "Another test project",
    technologies: ["Next.js", "Node.js"],
    githubURL: "https://github.com/test/project2",
    imageURL: "/test-image2.jpg",
    createdAt: "2023-02-01T00:00:00.000Z",
  },
];

const defaultProps = {
  projects: mockProjects,
  handleEdit: jest.fn(),
  handleDelete: jest.fn(),
  isAuthenticated: false,
};

// Mock scroll behavior
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 1024,
  writable: true,
});

Object.defineProperty(document.body, 'offsetHeight', {
  value: 2048,
  writable: true,
});

describe("ProjectList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  it("renders project titles and descriptions", () => {
    render(<ProjectList {...defaultProps} />);
    
    expect(screen.getByText("Test Project 1")).toBeInTheDocument();
    expect(screen.getByText("Test Project 2")).toBeInTheDocument();
    expect(screen.getByText("A test project description")).toBeInTheDocument();
    expect(screen.getByText("Another test project")).toBeInTheDocument();
  });

  it("displays project technologies", () => {
    render(<ProjectList {...defaultProps} />);
    
    expect(screen.getByText("React, TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js, Node.js")).toBeInTheDocument();
  });

  it("renders GitHub links for all projects", () => {
    render(<ProjectList {...defaultProps} />);
    
    const githubLinks = screen.getAllByText("GitHub");
    expect(githubLinks).toHaveLength(2);
    
    expect(githubLinks[0].closest('a')).toHaveAttribute('href', 'https://github.com/test/project1');
    expect(githubLinks[1].closest('a')).toHaveAttribute('href', 'https://github.com/test/project2');
  });

  it("renders project images when imageURL is provided", () => {
    render(<ProjectList {...defaultProps} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    
    expect(images[0]).toHaveAttribute('src', '/test-image.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Test Project 1');
    expect(images[1]).toHaveAttribute('src', '/test-image2.jpg');
    expect(images[1]).toHaveAttribute('alt', 'Test Project 2');
  });

  it("shows edit and delete buttons when authenticated", () => {
    render(<ProjectList {...defaultProps} isAuthenticated={true} />);
    
    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it("hides edit and delete buttons when not authenticated", () => {
    render(<ProjectList {...defaultProps} isAuthenticated={false} />);
    
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("calls handleEdit when edit button is clicked", () => {
    const handleEdit = jest.fn();
    render(<ProjectList {...defaultProps} handleEdit={handleEdit} isAuthenticated={true} />);
    
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    
    expect(handleEdit).toHaveBeenCalledWith(mockProjects[0]);
  });

  it("calls handleDelete when delete button is clicked", () => {
    const handleDelete = jest.fn();
    render(<ProjectList {...defaultProps} handleDelete={handleDelete} isAuthenticated={true} />);
    
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    
    expect(handleDelete).toHaveBeenCalledWith("1");
  });

  it("renders empty state gracefully when no projects", () => {
    render(<ProjectList {...defaultProps} projects={[]} />);
    
    // Component should render without errors
    const container = document.querySelector('.grid');
    expect(container).toBeInTheDocument();
  });
});
