import React from "react";
import { render } from "@testing-library/react";
import AnimatedSection from "@/components/AnimatedSection";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe("AnimatedSection", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <AnimatedSection>
        <div>Child Content</div>
      </AnimatedSection>
    );
    expect(getByText("Child Content")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const { container } = render(
      <AnimatedSection>
        <div>Test</div>
      </AnimatedSection>
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("p-8");
  });

  it("renders multiple children", () => {
    const { getByText } = render(
      <AnimatedSection>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </AnimatedSection>
    );
    
    expect(getByText("First Child")).toBeInTheDocument();
    expect(getByText("Second Child")).toBeInTheDocument();
    expect(getByText("Third Child")).toBeInTheDocument();
  });

  it("renders with no children without crashing", () => {
    const { container } = render(<AnimatedSection>{null}</AnimatedSection>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
