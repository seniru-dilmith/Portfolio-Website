import React from "react";
import { render, screen } from "@testing-library/react";
import JourneyContinues from "@/components/story/JorneyConinues";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div data-testid="animated-div" {...props}>
        {children}
      </div>
    ),
    h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
      <h2 data-testid="animated-heading" {...props}>
        {children}
      </h2>
    ),
    p: ({ children, ...props }: React.ComponentProps<"p">) => (
      <p data-testid="animated-paragraph" {...props}>
        {children}
      </p>
    ),
  },
}));

describe("JourneyContinues", () => {
  it("renders the main heading", () => {
    render(<JourneyContinues />);
    
    expect(screen.getByText("The Journey Continues")).toBeInTheDocument();
    expect(screen.getByText("The Journey Continues")).toHaveClass(
      "text-2xl",
      "md:text-3xl", 
      "font-bold",
      "mb-2",
      "md:mb-4",
      "text-primary"
    );
  });

  it("renders the main description paragraph", () => {
    render(<JourneyContinues />);
    
    const descriptionText = screen.getByText(/The story of growth, learning, and adventure/);
    expect(descriptionText).toBeInTheDocument();
    expect(descriptionText).toHaveClass(
      "text-sm",
      "md:text-base",
      "text-info"
    );
  });

  it("renders the inspirational quote", () => {
    render(<JourneyContinues />);
    
    const quote = screen.getByText(/Keep moving forward; the best is yet to come/i);
    expect(quote).toBeInTheDocument();
    expect(quote).toHaveClass(
      "text-warning",
      "text-lg",
      "md:text-xl",
      "lg:text-2xl",
      "font-semibold"
    );
  });

  it("applies correct container structure", () => {
    render(<JourneyContinues />);
    
    const containerDivs = screen.getAllByTestId("animated-div");
    
    // Find main container
    const mainContainer = containerDivs.find(div => 
      div.className?.includes("flex") && 
      div.className?.includes("flex-col") && 
      div.className?.includes("lg:flex-row")
    );
    
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass(
      "flex",
      "flex-col",
      "lg:flex-row",
      "gap-6",
      "lg:gap-8",
      "items-center"
    );
  });

  it("applies correct content section styling", () => {
    render(<JourneyContinues />);
    
    const contentDivs = screen.getAllByTestId("animated-div");
    
    // Find content section
    const contentSection = contentDivs.find(div => 
      div.className?.includes("text-center") && 
      div.className?.includes("bg-base-100")
    );
    
    expect(contentSection).toBeInTheDocument();
    expect(contentSection).toHaveClass(
      "text-center",
      "w-full",
      "mt-9",
      "p-4",
      "md:p-6",
      "bg-base-100",
      "rounded-lg",
      "shadow-lg"
    );
  });

  it("applies correct quote container styling", () => {
    render(<JourneyContinues />);
    
    const quoteDivs = screen.getAllByTestId("animated-div");
    
    // Find quote container
    const quoteContainer = quoteDivs.find(div => 
      div.className?.includes("text-center") && 
      div.className?.includes("relative") && 
      div.className?.includes("from-primary")
    );
    
    expect(quoteContainer).toBeInTheDocument();
    expect(quoteContainer).toHaveClass(
      "text-center",
      "relative",
      "w-full",
      "from-primary",
      "to-secondary",
      "rounded-lg",
      "flex",
      "items-center",
      "justify-center"
    );
  });

  it("contains expected content about the journey", () => {
    render(<JourneyContinues />);
    
    // Check for key content
    expect(screen.getByText(/growth, learning, and adventure/)).toBeInTheDocument();
    expect(screen.getByText(/new opportunities await/)).toBeInTheDocument();
    expect(screen.getByText(/brighter future/)).toBeInTheDocument();
    expect(screen.getByText(/Keep moving forward/)).toBeInTheDocument();
  });

  it("has proper responsive design classes", () => {
    render(<JourneyContinues />);
    
    const heading = screen.getByText("The Journey Continues");
    const description = screen.getByText(/The story of growth/);
    const quote = screen.getByText(/Keep moving forward/);
    
    expect(heading).toHaveClass("text-2xl", "md:text-3xl");
    expect(description).toHaveClass("text-sm", "md:text-base");
    expect(quote).toHaveClass("text-lg", "md:text-xl", "lg:text-2xl");
  });

  it("maintains proper text hierarchy", () => {
    render(<JourneyContinues />);
    
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("The Journey Continues");
    expect(heading).toHaveClass("font-bold");
    
    const quote = screen.getByText(/Keep moving forward/);
    expect(quote).toHaveClass("font-semibold");
  });

  it("applies proper spacing and layout classes", () => {
    render(<JourneyContinues />);
    
    const containerDivs = screen.getAllByTestId("animated-div");
    
    // Check main container spacing
    const mainContainer = containerDivs.find(div => 
      div.className?.includes("gap-6") && div.className?.includes("lg:gap-8")
    );
    expect(mainContainer).toHaveClass("gap-6", "lg:gap-8");
    
    // Check content section spacing
    const contentSection = containerDivs.find(div => 
      div.className?.includes("p-4") && div.className?.includes("md:p-6")
    );
    expect(contentSection).toHaveClass("p-4", "md:p-6");
  });

  it("renders with proper color scheme", () => {
    render(<JourneyContinues />);
    
    const heading = screen.getByText("The Journey Continues");
    const description = screen.getByText(/The story of growth/);
    const quote = screen.getByText(/Keep moving forward/);
    
    expect(heading).toHaveClass("text-primary");
    expect(description).toHaveClass("text-info");
    expect(quote).toHaveClass("text-warning");
  });

  it("maintains accessibility with proper semantic structure", () => {
    render(<JourneyContinues />);
    
    // Verify heading structure
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("The Journey Continues");
    
    // Verify readable content
    const description = screen.getByText(/adventure is far from over/);
    expect(description).toBeInTheDocument();
  });
});
