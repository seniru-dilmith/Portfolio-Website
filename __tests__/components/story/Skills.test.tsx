import React from "react";
import { render, screen } from "@testing-library/react";
import Skills from "@/components/story/Skills";
import "@testing-library/jest-dom";

// Mock the skills data
jest.mock("@/components/story/skills_data", () => ({
  skills: [
    "React.js",
    "Next.js", 
    "Laravel",
    "JAVA",
    "Python",
    "C/C++",
    "SQL",
    "NoSQL"
  ],
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="animated-div" {...props}>
        {children}
      </div>
    ),
    section: ({ children, ...props }: any) => (
      <section data-testid="animated-section" {...props}>
        {children}
      </section>
    ),
  },
}));

describe("Skills", () => {
  it("renders the main heading", () => {
    render(<Skills />);
    
    expect(screen.getByText("My Skills")).toBeInTheDocument();
    expect(screen.getByText("My Skills")).toHaveClass(
      "text-4xl",
      "font-bold",
      "mb-6"
    );
  });

  it("renders all skills from the skills data", () => {
    render(<Skills />);
    
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Laravel")).toBeInTheDocument();
    expect(screen.getByText("JAVA")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("C/C++")).toBeInTheDocument();
    expect(screen.getByText("SQL")).toBeInTheDocument();
    expect(screen.getByText("NoSQL")).toBeInTheDocument();
  });

  it("renders skills in skill cards with proper styling", () => {
    render(<Skills />);
    
    const skillCards = screen.getAllByText(/React\.js|Next\.js|Laravel|JAVA|Python|C\/C\+\+|SQL|NoSQL/);
    
    skillCards.forEach(skill => {
      const skillCard = skill.closest('div');
      expect(skillCard).toHaveClass(
        "bg-base-100",
        "text-primary-content",
        "p-4",
        "rounded-lg",
        "shadow-lg",
        "hover:shadow-xl",
        "transition-shadow"
      );
      expect(skill).toHaveClass("text-xl", "font-semibold");
    });
  });

  it("applies correct section styling", () => {
    render(<Skills />);
    
    const section = screen.getByText("My Skills").closest('section');
    expect(section).toHaveClass(
      "py-16",
      "bg-gradient-to-r",
      "from-blue-500",
      "via-indigo-500",
      "to-purple-600",
      "text-white",
      "text-center"
    );
  });

  it("applies correct container styling", () => {
    render(<Skills />);
    
    const containerDivs = screen.getAllByTestId("animated-div");
    
    // Find main container
    const mainContainer = containerDivs.find(div => 
      div.className?.includes("max-w-5xl") && 
      div.className?.includes("mx-auto")
    );
    
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass("max-w-5xl", "mx-auto");
  });

  it("applies correct grid layout", () => {
    render(<Skills />);
    
    // The grid should be a div containing the skill cards
    const gridContainer = screen.getByText("My Skills").parentElement?.querySelector('div');
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-2",
      "sm:grid-cols-3",
      "lg:grid-cols-4",
      "gap-6",
      "text-center"
    );
  });

  it("renders exactly 8 skill items", () => {
    render(<Skills />);
    
    const skillTexts = screen.getAllByText(/React\.js|Next\.js|Laravel|JAVA|Python|C\/C\+\+|SQL|NoSQL/);
    expect(skillTexts).toHaveLength(8);
  });

  it("maintains proper responsive grid classes", () => {
    render(<Skills />);
    
    // Find the grid container by looking for the element with grid classes
    const gridContainer = screen.getByText("React.js").closest('div')?.parentElement;
    
    expect(gridContainer).toHaveClass(
      "grid-cols-2",
      "sm:grid-cols-3", 
      "lg:grid-cols-4"
    );
  });

  it("maintains proper semantic structure", () => {
    render(<Skills />);
    
    // Verify heading structure
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("My Skills");
    
    // Verify section structure
    const section = screen.getByText("My Skills").closest('section');
    expect(section).toBeInTheDocument();
  });

  it("applies proper text hierarchy", () => {
    render(<Skills />);
    
    const heading = screen.getByText("My Skills");
    const skillTexts = screen.getAllByText(/React\.js|Next\.js|Laravel|JAVA|Python|C\/C\+\+|SQL|NoSQL/);
    
    expect(heading).toHaveClass("text-4xl", "font-bold");
    
    skillTexts.forEach(skillText => {
      expect(skillText).toHaveClass("text-xl", "font-semibold");
    });
  });

  it("uses correct color scheme", () => {
    render(<Skills />);
    
    const section = screen.getByText("My Skills").closest('section');
    expect(section).toHaveClass("text-white");
    
    const skillCards = screen.getAllByText(/React\.js|Next\.js|Laravel|JAVA|Python|C\/C\+\+|SQL|NoSQL/);
    
    skillCards.forEach(skill => {
      const skillCard = skill.closest('div');
      expect(skillCard).toHaveClass("bg-base-100", "text-primary-content");
    });
  });

  it("applies hover effects correctly", () => {
    render(<Skills />);
    
    const skillCards = screen.getAllByText(/React\.js|Next\.js|Laravel|JAVA|Python|C\/C\+\+|SQL|NoSQL/);
    
    skillCards.forEach(skill => {
      const skillCard = skill.closest('div');
      expect(skillCard).toHaveClass("hover:shadow-xl", "transition-shadow");
    });
  });

  it("handles different skill names correctly", () => {
    render(<Skills />);
    
    // Test that special characters and different formats are handled
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("C/C++")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    
    // Verify each skill is in its own card
    const reactSkill = screen.getByText("React.js");
    const cppSkill = screen.getByText("C/C++");
    const nextSkill = screen.getByText("Next.js");
    
    expect(reactSkill.closest('div')).not.toBe(cppSkill.closest('div'));
    expect(reactSkill.closest('div')).not.toBe(nextSkill.closest('div'));
  });
});
