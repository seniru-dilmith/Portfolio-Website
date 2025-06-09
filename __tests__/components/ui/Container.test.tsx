import React from "react";
import { render, screen } from "@testing-library/react";
import Container from "@/components/ui/Container";
import "@testing-library/jest-dom";

// Mock framer-motion
interface MockMotionDivProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...motionProps }: MockMotionDivProps) => (
      <div
        className={className}
        data-testid="motion-div"
        data-motion-props={JSON.stringify(motionProps)}
        {...motionProps}
      >
        {children}
      </div>
    ),
  },
}));

describe("Container", () => {
  const TestContent = () => <div data-testid="test-content">Test Content</div>;

  it("renders children correctly", () => {
    render(
      <Container>
        <TestContent />
      </Container>
    );
    
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(
      <Container>
        <TestContent />
      </Container>
    );
    
    const outerContainer = screen.getByTestId("test-content").parentElement?.parentElement;
    expect(outerContainer).toHaveClass("mx-auto", "max-w-7xl");
    
    const innerContainer = screen.getByTestId("motion-div");
    expect(innerContainer).toHaveClass("px-4", "sm:px-6", "lg:px-8");
  });

  it("applies custom maxWidth", () => {
    render(
      <Container maxWidth="max-w-4xl">
        <TestContent />
      </Container>
    );
    
    const outerContainer = screen.getByTestId("test-content").parentElement?.parentElement;
    expect(outerContainer).toHaveClass("max-w-4xl");
  });

  it("applies custom padding", () => {
    render(
      <Container padding="px-8 py-4">
        <TestContent />
      </Container>
    );
    
    const innerContainer = screen.getByTestId("motion-div");
    expect(innerContainer).toHaveClass("px-8", "py-4");
  });

  it("applies custom className", () => {
    const customClass = "custom-container-class";
    render(
      <Container className={customClass}>
        <TestContent />
      </Container>
    );
    
    const outerContainer = screen.getByTestId("test-content").parentElement?.parentElement;
    expect(outerContainer).toHaveClass(customClass);
  });

  it("renders with animation by default", () => {
    render(
      <Container>
        <TestContent />
      </Container>
    );
    
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toBeInTheDocument();
    
    const motionProps = JSON.parse(motionDiv.getAttribute("data-motion-props") || "{}");
    expect(motionProps.initial).toEqual({ opacity: 0, y: 20 });
    expect(motionProps.animate).toEqual({ opacity: 1, y: 0 });
    expect(motionProps.transition).toEqual({ duration: 0.6, delay: 0.2 });
  });

  it("renders without animation when animated is false", () => {
    render(
      <Container animated={false}>
        <TestContent />
      </Container>
    );
    
    // Should not have motion div when animated is false
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
    
    // Should render regular div structure
    const content = screen.getByTestId("test-content");
    const innerContainer = content.parentElement;
    const outerContainer = innerContainer?.parentElement;
    
    expect(innerContainer).toHaveClass("px-4", "sm:px-6", "lg:px-8");
    expect(outerContainer).toHaveClass("mx-auto", "max-w-7xl");
  });

  it("applies custom motion props", () => {
    const customMotionProps = {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 1, delay: 0.5 }
    };
    
    render(
      <Container motionProps={customMotionProps}>
        <TestContent />
      </Container>
    );
    
    const motionDiv = screen.getByTestId("motion-div");
    const motionProps = JSON.parse(motionDiv.getAttribute("data-motion-props") || "{}");
    
    expect(motionProps.initial).toEqual(customMotionProps.initial);
    expect(motionProps.animate).toEqual(customMotionProps.animate);
    expect(motionProps.transition).toEqual(customMotionProps.transition);
  });

  it("combines all styling props correctly", () => {
    render(
      <Container 
        maxWidth="max-w-5xl"
        padding="px-6 py-8"
        className="bg-gray-100 rounded-lg"
      >
        <TestContent />
      </Container>
    );
    
    const outerContainer = screen.getByTestId("test-content").parentElement?.parentElement;
    const innerContainer = screen.getByTestId("motion-div");
    
    expect(outerContainer).toHaveClass("mx-auto", "max-w-5xl", "bg-gray-100", "rounded-lg");
    expect(innerContainer).toHaveClass("px-6", "py-8");
  });

  it("handles complex children structure", () => {
    render(
      <Container>
        <div data-testid="complex-child">
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      </Container>
    );
    
    expect(screen.getByTestId("complex-child")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it("handles empty children", () => {
    render(<Container><div></div></Container>);
    
    // Should still render container structure
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("handles text content as children", () => {
    render(<Container>Simple text content</Container>);
    
    expect(screen.getByText("Simple text content")).toBeInTheDocument();
  });

  it("maintains responsive design classes", () => {
    render(
      <Container>
        <TestContent />
      </Container>
    );
    
    const innerContainer = screen.getByTestId("motion-div");
    
    // Check responsive padding classes
    expect(innerContainer).toHaveClass("px-4"); // mobile
    expect(innerContainer).toHaveClass("sm:px-6"); // small screens
    expect(innerContainer).toHaveClass("lg:px-8"); // large screens
  });

  it("preserves container hierarchy", () => {
    render(
      <Container>
        <TestContent />
      </Container>
    );
    
    const content = screen.getByTestId("test-content");
    const motionDiv = content.parentElement;
    const outerDiv = motionDiv?.parentElement;
    
    expect(motionDiv).toHaveAttribute("data-testid", "motion-div");
    expect(outerDiv).toHaveClass("mx-auto");
  });
});
