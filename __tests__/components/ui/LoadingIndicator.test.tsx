import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import "@testing-library/jest-dom";

// Mock SmallLoadingSpinner
jest.mock("@/util/SmallLoadingSpinner", () => {
  return function MockSmallLoadingSpinner() {
    return <div data-testid="small-loading-spinner">Loading...</div>;
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, initial, animate, exit, transition, ...props }: any) => (
      <div
        className={className}
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-exit={JSON.stringify(exit)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </div>
    ),
    p: ({ children, className, animate, transition, ...props }: any) => {
      // Handle Infinity in repeat property
      const processedTransition = transition ? {
        ...transition,
        repeat: transition.repeat === Infinity ? "Infinity" : transition.repeat
      } : transition;
      
      return (
        <p
          className={className}
          data-testid="motion-text"
          data-animate={JSON.stringify(animate)}
          data-transition={JSON.stringify(processedTransition)}
          {...props}
        >
          {children}
        </p>
      );
    },
  },
}));

describe("LoadingIndicator", () => {
  it("renders when show prop is true", () => {
    render(<LoadingIndicator show={true} />);
    
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
    expect(screen.getByTestId("small-loading-spinner")).toBeInTheDocument();
    expect(screen.getAllByText("Loading...")).toHaveLength(2); // One from spinner mock, one from motion.p
  });

  it("does not render when show prop is false", () => {
    render(<LoadingIndicator show={false} />);
    
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
    expect(screen.queryByTestId("small-loading-spinner")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("displays custom text", () => {
    const customText = "Please wait...";
    render(<LoadingIndicator show={true} text={customText} />);
    
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-loading-class";
    render(<LoadingIndicator show={true} className={customClass} />);
    
    const container = screen.getByTestId("motion-div");
    expect(container).toHaveClass(customClass);
  });

  it("renders custom spinner when provided", () => {
    const CustomSpinner = () => <div data-testid="custom-spinner">Custom Spinner</div>;
    render(<LoadingIndicator show={true} customSpinner={<CustomSpinner />} />);
    
    expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("small-loading-spinner")).not.toBeInTheDocument();
  });

  it("applies correct default styling classes", () => {
    render(<LoadingIndicator show={true} />);
    
    const container = screen.getByTestId("motion-div");
    expect(container).toHaveClass(
      "flex",
      "flex-col", 
      "items-center",
      "justify-center",
      "py-20",
      "relative",
      "z-20"
    );
  });

  it("configures motion animations correctly", () => {
    render(<LoadingIndicator show={true} />);
    
    const container = screen.getByTestId("motion-div");
    const initialData = JSON.parse(container.getAttribute("data-initial") || "{}");
    const animateData = JSON.parse(container.getAttribute("data-animate") || "{}");
    const exitData = JSON.parse(container.getAttribute("data-exit") || "{}");
    const transitionData = JSON.parse(container.getAttribute("data-transition") || "{}");
    
    expect(initialData.opacity).toBe(0);
    expect(animateData.opacity).toBe(1);
    expect(exitData.opacity).toBe(0);
    expect(transitionData.duration).toBe(0.3);
  });

  it("configures text animation correctly", () => {
    render(<LoadingIndicator show={true} />);
    
    const textElement = screen.getByTestId("motion-text");
    const animateData = JSON.parse(textElement.getAttribute("data-animate") || "{}");
    const transitionData = JSON.parse(textElement.getAttribute("data-transition") || "{}");
    
    expect(animateData.opacity).toEqual([0.5, 1, 0.5]);
    expect(transitionData.duration).toBe(2);
    expect(transitionData.repeat).toBe("Infinity");
    expect(transitionData.ease).toBe("easeInOut");
  });

  it("applies correct text styling", () => {
    render(<LoadingIndicator show={true} />);
    
    const textElement = screen.getByTestId("motion-text");
    expect(textElement).toHaveClass("mt-4", "text-muted-foreground", "text-center");
  });

  it("handles empty custom text", () => {
    render(<LoadingIndicator show={true} text="" />);
    
    const textElement = screen.getByTestId("motion-text");
    expect(textElement).toHaveTextContent("");
  });

  it("maintains accessibility with loading text", () => {
    render(<LoadingIndicator show={true} text="Loading content..." />);
    
    expect(screen.getByText("Loading content...")).toBeInTheDocument();
  });

  it("respects show prop changes", () => {
    const { rerender } = render(<LoadingIndicator show={false} />);
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
    
    rerender(<LoadingIndicator show={true} />);
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
    
    rerender(<LoadingIndicator show={false} />);
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
  });
});
