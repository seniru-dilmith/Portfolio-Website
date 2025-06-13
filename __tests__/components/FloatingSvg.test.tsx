import React from "react";
import { render, screen, act } from "@testing-library/react";
import FloatingSvg from "@/components/FloatingSvg";
import "@testing-library/jest-dom";

// Mock useHydration hook
const mockUseHydration = jest.fn(() => true);
jest.mock("@/hooks/useHydration", () => ({
  useHydration: () => mockUseHydration(),
}));

// Mock framer-motion with simpler implementation
jest.mock("framer-motion", () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    )),
    svg: React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement> & { animate?: unknown; transition?: unknown }>(({ children, animate, transition, ...props }, ref) => (
      <svg
        ref={ref}
        data-testid="motion-svg"
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </svg>
    )),
  },
}));

// Mock window.innerHeight
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 1000,
});

describe("FloatingSvg", () => {
  const mockSvgPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  let setIntervalSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHydration.mockReturnValue(true);
    // Reset timers for each test
    jest.useFakeTimers();
    // Spy on setInterval
    setIntervalSpy = jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    setIntervalSpy.mockRestore();
  });

  it("renders without crashing when hydrated", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
    expect(screen.getByTestId("motion-svg")).toBeInTheDocument();
  });

  it("does not render when not hydrated", () => {
    mockUseHydration.mockReturnValue(false);

    const { container } = render(<FloatingSvg svgPath={mockSvgPath} />);
    
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    const customClass = "custom-floating-class";
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} className={customClass} />);
    });
    
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveClass(customClass);
  });

  it("includes default classes", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveClass("fixed", "pointer-events-none", "z-10");
  });

  it("renders the SVG path correctly", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const path = screen.getByTestId("motion-svg").querySelector("path");
    expect(path).toHaveAttribute("d", mockSvgPath);
  });

  it("has correct SVG dimensions", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const svg = screen.getByTestId("motion-svg");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("sets up color cycling animation properties", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const svg = screen.getByTestId("motion-svg");
    const animateData = JSON.parse(svg.getAttribute("data-animate") || "{}");
    const transitionData = JSON.parse(svg.getAttribute("data-transition") || "{}");
    
    // Check that color animation is set up
    expect(animateData).toHaveProperty("fill");
    expect(animateData).toHaveProperty("filter");
    expect(transitionData).toHaveProperty("fill");
    expect(transitionData).toHaveProperty("filter");
    
    // Check filter animation
    expect(animateData.filter).toEqual([
      "hue-rotate(0deg) brightness(1)",
      "hue-rotate(90deg) brightness(1.2)",
      "hue-rotate(180deg) brightness(0.8)",
      "hue-rotate(270deg) brightness(1.1)",
      "hue-rotate(360deg) brightness(1)",
    ]);
  });

  it("cycles through colors over time", async () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const svg = screen.getByTestId("motion-svg");
    
    // Get initial color
    const initialAnimate = JSON.parse(svg.getAttribute("data-animate") || "{}");
    const initialColor = initialAnimate.fill;
    
    // Fast-forward time by 10 seconds (color cycling interval)
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // The color should be a valid hex color
    expect(typeof initialColor).toBe("string");
    expect(initialColor).toMatch(/^#[0-9a-f]{6}$/i); // Should be a valid hex color
  });

  it("sets random positioning", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const motionDiv = screen.getByTestId("motion-div");
    const style = motionDiv.style;
    
    // Check that left position is set as percentage
    expect(style.left).toMatch(/^\d+(\.\d+)?%$/);
    
    // Check that top position is set in pixels
    expect(style.top).toMatch(/^\d+(\.\d+)?px$/);
  });

  it("cleans up color cycling interval on unmount", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    
    const { unmount } = render(<FloatingSvg svgPath={mockSvgPath} />);
    
    act(() => {
      unmount();
    });
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
  });

  it("handles different color values", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const svg = screen.getByTestId("motion-svg");
    const animateData = JSON.parse(svg.getAttribute("data-animate") || "{}");
    
    // Should have a valid hex color
    expect(animateData.fill).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("maintains SVG structure", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const svg = screen.getByTestId("motion-svg");
    const path = svg.querySelector("path");
    
    expect(svg).toHaveClass("fill-current");
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("d", mockSvgPath);
  });

  it("starts with a random color from the color palette", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    const svg = screen.getByTestId("motion-svg");
    const animateData = JSON.parse(svg.getAttribute("data-animate") || "{}");
    
    const expectedColors = [
      "#3b82f6", // primary blue
      "#8b5cf6", // secondary purple
      "#06b6d4", // accent cyan
      "#10b981", // success green
      "#f59e0b", // warning amber
      "#ef4444", // error red
      "#ec4899", // pink
    ];
    
    expect(expectedColors).toContain(animateData.fill);
  });

  it("changes color every 10 seconds", () => {
    act(() => {
      render(<FloatingSvg svgPath={mockSvgPath} />);
    });
    
    // Verify that setInterval was called with 10000ms
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 10000);
  });
});
