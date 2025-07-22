import React from "react";
import { render, screen } from "@testing-library/react";
import MyStory from "@/components/story/MyStory";
import "@testing-library/jest-dom";

// Mock framer-motion
interface MockMotionProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    h2: ({ children, ...props }: MockMotionProps) => (
      <h2 data-testid="animated-heading" {...props}>
        {children}
      </h2>
    ),
    p: ({ children, ...props }: MockMotionProps) => (
      <p data-testid="animated-paragraph" {...props}>
        {children}
      </p>
    ),
    div: ({ children, ...props }: MockMotionProps) => (
      <div data-testid="animated-div" {...props}>
        {children}
      </div>
    ),
    section: ({ children, ...props }: MockMotionProps) => (
      <section data-testid="animated-section" {...props}>
        {children}
      </section>
    ),
  },
}));

describe("MyStory", () => {
  it("renders the main heading", () => {
    render(<MyStory />);
    
    expect(screen.getByText("My Story")).toBeInTheDocument();
    expect(screen.getByText("My Story")).toHaveClass(
      "text-5xl", 
      "font-bold", 
      "text-white", 
      "mb-12", 
      "text-center"
    );
  });

  it("renders the main introduction paragraph", () => {
    render(<MyStory />);
    
    // Check for key parts of the intro text
    expect(screen.getByText(/passionate Computer Science and Engineering undergraduate/)).toBeInTheDocument();
    
    // Check for highlighted name
    expect(screen.getByText("Seniru Dilmith")).toBeInTheDocument();
    expect(screen.getByText("Seniru Dilmith")).toHaveClass(
      "font-semibold", 
      "text-yellow-400"
    );
  });

  it("renders the secondary paragraph about interests", () => {
    render(<MyStory />);
    
    const secondaryText = screen.getByText(/Beyond coding/, { exact: false });
    expect(secondaryText).toBeInTheDocument();
    expect(secondaryText).toHaveClass(
      "mt-6", 
      "text-lg", 
      "text-gray-300", 
      "leading-relaxed", 
      "text-center"
    );
  });

  it("renders decorative elements", () => {
    render(<MyStory />);
    
    const decorativeElements = screen.getAllByTestId("animated-div");
    
    // Find the container and circular elements
    const decorativeContainer = decorativeElements.find(el => 
      el.className?.includes("mt-12") && 
      el.className?.includes("flex") && 
      el.className?.includes("justify-center")
    );
    
    expect(decorativeContainer).toBeInTheDocument();
    expect(decorativeContainer).toHaveClass(
      "mt-12", 
      "flex", 
      "justify-center", 
      "gap-16", 
      "md:gap-60"
    );
  });

  it("renders three circular decorative elements", () => {
    render(<MyStory />);
    
    const decorativeElements = screen.getAllByTestId("animated-div");
    
    // Find circular elements by their styling
    const circularElements = decorativeElements.filter(el => 
      el.className?.includes("w-8") && 
      el.className?.includes("h-8") && 
      el.className?.includes("bg-base-300") && 
      el.className?.includes("rounded-full")
    );
    
    expect(circularElements).toHaveLength(3);
    
    circularElements.forEach(element => {
      expect(element).toHaveClass(
        "w-8", 
        "h-8", 
        "bg-base-300", 
        "rounded-full", 
        "shadow-lg"
      );
    });
  });

  it("applies correct section styling", () => {
    render(<MyStory />);
    
    const section = screen.getByTestId("animated-section");
    expect(section).toHaveClass(
      "py-16", 
      "px-8", 
      "bg-gradient-to-br", 
      "from-primary", 
      "via-secondary", 
      "to-accent", 
      "text-primary-content", 
      "rounded-lg", 
      "shadow-2xl"
    );
  });

  it("contains expected content about skills and interests", () => {
    render(<MyStory />);
    
    // Check for key content
    expect(screen.getByText(/Computer Science and Engineering/)).toBeInTheDocument();
    expect(screen.getByText(/University of Moratuwa/)).toBeInTheDocument();
    expect(screen.getByText(/software development/)).toBeInTheDocument();
    expect(screen.getByText(/networking/)).toBeInTheDocument();
    expect(screen.getByText(/music enthusiast/)).toBeInTheDocument();
    expect(screen.getByText(/keyboard/)).toBeInTheDocument();
    expect(screen.getByText(/MoraSpirit/)).toBeInTheDocument();
  });

  it("has proper text hierarchy and styling", () => {
    render(<MyStory />);
    
    const heading = screen.getByText("My Story");
    const paragraphs = screen.getAllByTestId("animated-paragraph");
    
    expect(heading).toHaveClass("text-5xl", "font-bold");
    
    paragraphs.forEach(paragraph => {
      expect(paragraph).toHaveClass("text-lg", "leading-relaxed", "text-center");
    });
  });

  it("renders with proper responsive design classes", () => {
    render(<MyStory />);
    
    const decorativeContainer = screen.getAllByTestId("animated-div").find(el => 
      el.className?.includes("gap-16") && el.className?.includes("md:gap-60")
    );
    
    expect(decorativeContainer).toHaveClass("gap-16", "md:gap-60");
  });

  it("maintains accessibility with proper text content", () => {
    render(<MyStory />);
    
    // Verify heading structure
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("My Story");
    
    // Verify readable text content
    const content = screen.getByText(/passionate Computer Science/);
    expect(content).toBeInTheDocument();
  });
});
