import React from "react";
import { render, screen } from "@testing-library/react";
import FloatingElements from "@/components/background/FloatingElements";
import "@testing-library/jest-dom";

// Mock FloatingSvg component
jest.mock("@/components/FloatingSvg", () => {
  return function MockFloatingSvg({ svgPath, className }: { svgPath: string; className?: string }) {
    return (
      <div 
        data-testid="floating-svg"
        data-svg-path={svgPath}
        className={className}
      >
        FloatingSvg
      </div>
    );
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, style, animate, transition, ...props }: React.ComponentProps<'div'> & { 
      animate?: object; 
      transition?: { repeat?: number | typeof Infinity; [key: string]: unknown }; 
    }) => {
      // Handle Infinity in transition.repeat
      const processedTransition = transition ? {
        ...transition,
        repeat: transition.repeat === Infinity ? "Infinity" : transition.repeat
      } : transition;
      
      return (
        <div
          className={className}
          style={style}
          data-testid="motion-div"
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

describe("FloatingElements", () => {
  const mockSvgPaths = [
    "M12 2L3.09 8.26L4 21L12 17L20 21L20.91 8.26L12 2Z",
    "M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2Z",
    "M4 6L8 10L16 2L22 8L14 16L10 12L4 6Z"
  ];

  beforeEach(() => {
    // Mock Math.random to make tests deterministic
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders with default props", () => {
    render(<FloatingElements svgPaths={mockSvgPaths} />);
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    expect(floatingSvgs.length).toBeGreaterThan(0);
  });

  it("renders correct number of primary floating elements", () => {
    render(<FloatingElements svgPaths={mockSvgPaths} primaryCount={3} />);
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    // Should have at least 3 primary elements (plus extra and ambient)
    expect(floatingSvgs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders extra floating elements", () => {
    render(<FloatingElements svgPaths={mockSvgPaths} extraCount={5} />);
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    // Should include extra elements
    expect(floatingSvgs.length).toBeGreaterThan(5);
  });

  it("renders ambient floating elements", () => {
    render(<FloatingElements svgPaths={mockSvgPaths} ambientCount={3} />);
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    // Should include ambient elements
    expect(floatingSvgs.length).toBeGreaterThan(3);
  });

  it("renders star particles", () => {
    render(<FloatingElements svgPaths={mockSvgPaths} starCount={5} />);
    
    const stars = screen.getAllByTestId("motion-div");
    // Should have star particles (motion divs)
    expect(stars.length).toBe(5);
  });

  it("applies correct SVG paths to floating elements", () => {
    render(<FloatingElements svgPaths={mockSvgPaths} primaryCount={2} />);
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    
    // Check that the first few elements have the correct SVG paths
    expect(floatingSvgs[0]).toHaveAttribute("data-svg-path", mockSvgPaths[0]);
    expect(floatingSvgs[1]).toHaveAttribute("data-svg-path", mockSvgPaths[1]);
  });

  it("cycles through SVG paths for extra elements", () => {
    render(
      <FloatingElements 
        svgPaths={mockSvgPaths} 
        primaryCount={0} 
        extraCount={5} 
        ambientCount={0}
        starCount={0}
      />
    );
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    
    // Should cycle through available paths
    expect(floatingSvgs).toHaveLength(5);
    expect(floatingSvgs[0]).toHaveAttribute("data-svg-path", mockSvgPaths[0]);
    expect(floatingSvgs[3]).toHaveAttribute("data-svg-path", mockSvgPaths[0]); // Cycles back
  });

  it("applies opacity classes to extra elements", () => {
    render(
      <FloatingElements 
        svgPaths={mockSvgPaths} 
        primaryCount={0} 
        extraCount={2} 
        ambientCount={0}
        starCount={0}
      />
    );
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    
    // Extra elements should have opacity classes
    const className = floatingSvgs[0].className;
    expect(className).toMatch(/opacity-\d+/);
  });

  it("applies custom star opacity and color", () => {
    render(
      <FloatingElements 
        svgPaths={mockSvgPaths} 
        primaryCount={0}
        extraCount={0}
        ambientCount={0}
        starCount={2}
        starOpacity="75"
        starColor="primary/80"
      />
    );
    
    const stars = screen.getAllByTestId("motion-div");
    
    // Stars should be rendered
    expect(stars).toHaveLength(2);
    
    // Check that stars have the correct styling
    stars.forEach(star => {
      expect(star).toHaveClass("fixed", "pointer-events-none", "z-5");
      const child = star.firstChild as HTMLElement;
      expect(child).toHaveClass("w-1.5", "h-1.5", "bg-primary/80", "rounded-full");
    });
  });

  it("handles edge case with empty SVG paths array", () => {
    render(<FloatingElements svgPaths={[]} primaryCount={0} extraCount={0} ambientCount={0} starCount={5} />);
    
    // Should still render star particles but no SVG elements
    const stars = screen.getAllByTestId("motion-div");
    expect(stars.length).toBe(5);
    
    const floatingSvgs = screen.queryAllByTestId("floating-svg");
    expect(floatingSvgs).toHaveLength(0);
  });

  it("handles edge case with single SVG path", () => {
    const singlePath = [mockSvgPaths[0]];
    render(
      <FloatingElements 
        svgPaths={singlePath} 
        primaryCount={1}
        extraCount={3}
        ambientCount={2}
        starCount={0}
      />
    );
    
    const floatingSvgs = screen.getAllByTestId("floating-svg");
    
    // All floating elements should use the same path
    floatingSvgs.forEach(svg => {
      expect(svg).toHaveAttribute("data-svg-path", singlePath[0]);
    });
  });

  it("applies correct positioning to stars", () => {
    render(
      <FloatingElements 
        svgPaths={mockSvgPaths} 
        primaryCount={0}
        extraCount={0}
        ambientCount={0}
        starCount={1}
      />
    );
    
    const star = screen.getByTestId("motion-div");
    
    // Stars should have absolute positioning styles
    expect(star).toHaveStyle({
      left: "50%", // Math.random() mocked to return 0.5
      top: "50%"
    });
  });  it("configures star animations correctly", () => {
    render(
      <FloatingElements 
        svgPaths={mockSvgPaths}
        primaryCount={0}
        extraCount={0}
        ambientCount={0}
        starCount={1}
      />
    );
    
    const star = screen.getByTestId("motion-div");
    const animateData = JSON.parse(star.getAttribute("data-animate") || "{}");
    const transitionData = JSON.parse(star.getAttribute("data-transition") || "{}");
    
    expect(animateData.opacity).toEqual([0, 0.8, 0]);
    expect(animateData.scale).toEqual([0.3, 1.2, 0.3]);
    expect(transitionData.repeat).toBe("Infinity");
    expect(transitionData.ease).toBe("easeInOut");
  });
});
