import React from "react";
import { render, screen } from "@testing-library/react";
import AnimatedBackground from "@/components/background/AnimatedBackground";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, style, animate, transition, ...props }: React.PropsWithChildren<{
      className?: string;
      style?: React.CSSProperties;
      animate?: Record<string, unknown>;
      transition?: Record<string, unknown> & { repeat?: number | "Infinity" };
      [key: string]: unknown;
    }>) => {
      // Handle Infinity in repeat property
      const processedTransition = transition ? {
        ...transition,
        repeat: transition.repeat === Infinity ? "Infinity" : transition.repeat
      } : transition;
      
      return (
        <div
          className={className}
          style={style}
          data-testid="animated-background"
          data-animate={JSON.stringify(animate)}
          data-transition={JSON.stringify(processedTransition)}
          {...props}
        >
          {children}
        </div>
      );
    },
  },
}));

describe("AnimatedBackground", () => {
  it("renders with default props", () => {
    render(<AnimatedBackground />);
    
    const background = screen.getByTestId("animated-background");
    expect(background).toBeInTheDocument();
    expect(background).toHaveClass("absolute", "inset-0", "pointer-events-none");
  });

  it("applies custom gradient colors", () => {
    const props = {
      gradientFrom: "red/0.2",
      gradientVia: "blue/0.1",
      gradientTo: "green/0.3",
    };
    
    render(<AnimatedBackground {...props} />);
    
    const background = screen.getByTestId("animated-background");
    const animateData = JSON.parse(background.getAttribute("data-animate") || "{}");
    
    expect(animateData.background).toEqual(
      expect.arrayContaining([
        expect.stringContaining("red/0.2"),
        expect.stringContaining("blue/0.1"),
        expect.stringContaining("green/0.3"),
      ])
    );
  });

  it("applies custom duration", () => {
    render(<AnimatedBackground duration={15} />);
    
    const background = screen.getByTestId("animated-background");
    const transitionData = JSON.parse(background.getAttribute("data-transition") || "{}");
    
    expect(transitionData.duration).toBe(15);
    expect(transitionData.repeat).toBe("Infinity");
    expect(transitionData.ease).toBe("easeInOut");
  });

  it("applies custom opacity", () => {
    render(<AnimatedBackground opacity={0.5} />);
    
    const background = screen.getByTestId("animated-background");
    expect(background).toHaveStyle({ opacity: "0.5" });
  });

  it("generates gradient variations correctly", () => {
    render(<AnimatedBackground />);
    
    const background = screen.getByTestId("animated-background");
    const animateData = JSON.parse(background.getAttribute("data-animate") || "{}");
    
    expect(animateData.background).toHaveLength(4);
    expect(animateData.background[0]).toContain("45deg");
    expect(animateData.background[1]).toContain("135deg");
    expect(animateData.background[2]).toContain("225deg");
    expect(animateData.background[3]).toContain("315deg");
  });

  it("uses CSS custom properties for default gradients", () => {
    render(<AnimatedBackground />);
    
    const background = screen.getByTestId("animated-background");
    const animateData = JSON.parse(background.getAttribute("data-animate") || "{}");
    
    expect(animateData.background[0]).toContain("var(--primary)/0.1");
    expect(animateData.background[0]).toContain("var(--accent)/0.1");
  });

  it("handles edge case with zero opacity", () => {
    render(<AnimatedBackground opacity={0} />);
    
    const background = screen.getByTestId("animated-background");
    expect(background).toHaveStyle({ opacity: "0" });
  });

  it("handles edge case with very short duration", () => {
    render(<AnimatedBackground duration={0.1} />);
    
    const background = screen.getByTestId("animated-background");
    const transitionData = JSON.parse(background.getAttribute("data-transition") || "{}");
    
    expect(transitionData.duration).toBe(0.1);
  });
});
