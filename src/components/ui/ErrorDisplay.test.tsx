import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import "@testing-library/jest-dom";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  AlertCircle: ({ className }: { className?: string }) => (
    <div data-testid="alert-circle" className={className}>Alert Icon</div>
  ),
  X: ({ className }: { className?: string }) => (
    <div data-testid="x-icon" className={className}>X Icon</div>
  ),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, initial, animate, exit, transition, ...props }: React.PropsWithChildren<{
      className?: string;
      initial?: Record<string, unknown>;
      animate?: Record<string, unknown>;
      exit?: Record<string, unknown>;
      transition?: Record<string, unknown>;
      [key: string]: unknown;
    }>) => (
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
  },
}));

describe("ErrorDisplay", () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when error is provided", () => {
    render(<ErrorDisplay error="Test error message" />);
    
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
    expect(screen.getByTestId("alert-circle")).toBeInTheDocument();
  });

  it("does not render when error is null", () => {
    render(<ErrorDisplay error={null} />);
    
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
    expect(screen.queryByTestId("alert-circle")).not.toBeInTheDocument();
  });

  it("does not render when error is empty string", () => {
    render(<ErrorDisplay error="" />);
    
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
  });

  it("applies correct default error styling", () => {
    render(<ErrorDisplay error="Test error" />);
    
    const container = screen.getByTestId("motion-div");
    expect(container).toHaveClass(
      "text-red-500",
      "bg-red-50",
      "border-red-200",
      "border",
      "rounded-lg"
    );
  });

  it("applies warning styling when type is warning", () => {
    render(<ErrorDisplay error="Test warning" type="warning" />);
    
    const container = screen.getByTestId("motion-div");
    expect(container).toHaveClass(
      "text-yellow-500",
      "bg-yellow-50",
      "border-yellow-200"
    );
  });

  it("applies info styling when type is info", () => {
    render(<ErrorDisplay error="Test info" type="info" />);
    
    const container = screen.getByTestId("motion-div");
    expect(container).toHaveClass(
      "text-blue-500",
      "bg-blue-50",
      "border-blue-200"
    );
  });

  it("applies custom className", () => {
    const customClass = "custom-error-class";
    render(<ErrorDisplay error="Test error" className={customClass} />);
    
    const container = screen.getByTestId("motion-div");
    expect(container).toHaveClass(customClass);
  });

  it("does not show dismiss button when not dismissible", () => {
    render(<ErrorDisplay error="Test error" dismissible={false} />);
    
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  it("shows dismiss button when dismissible is true", () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        dismissible={true} 
        onDismiss={mockOnDismiss}
      />
    );
    
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  it("does not show dismiss button when dismissible but no onDismiss", () => {
    render(<ErrorDisplay error="Test error" dismissible={true} />);
    
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        dismissible={true} 
        onDismiss={mockOnDismiss}
      />
    );
    
    const dismissButton = screen.getByTestId("x-icon").parentElement as HTMLElement;
    fireEvent.click(dismissButton);
    
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it("configures motion animations correctly", () => {
    render(<ErrorDisplay error="Test error" />);
    
    const container = screen.getByTestId("motion-div");
    const initialData = JSON.parse(container.getAttribute("data-initial") || "{}");
    const animateData = JSON.parse(container.getAttribute("data-animate") || "{}");
    const exitData = JSON.parse(container.getAttribute("data-exit") || "{}");
    const transitionData = JSON.parse(container.getAttribute("data-transition") || "{}");
    
    expect(initialData.opacity).toBe(0);
    expect(initialData.y).toBe(-20);
    expect(animateData.opacity).toBe(1);
    expect(animateData.y).toBe(0);
    expect(exitData.opacity).toBe(0);
    expect(exitData.y).toBe(-20);
    expect(transitionData.duration).toBe(0.3);
  });

  it("includes correct accessibility attributes for dismiss button", () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        dismissible={true} 
        onDismiss={mockOnDismiss}
      />
    );
    
    const dismissButton = screen.getByTestId("x-icon").parentElement as HTMLElement;
    expect(dismissButton).toHaveAttribute("aria-label", "Dismiss error");
  });

  it("applies correct icon styling", () => {
    render(<ErrorDisplay error="Test error" />);
    
    const alertIcon = screen.getByTestId("alert-circle");
    expect(alertIcon).toHaveClass("w-5", "h-5");
  });

  it("applies correct dismiss button styling", () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        dismissible={true} 
        onDismiss={mockOnDismiss}
      />
    );
    
    const dismissButton = screen.getByTestId("x-icon").parentElement as HTMLElement;
    expect(dismissButton).toHaveClass(
      "ml-2",
      "p-1",
      "hover:bg-opacity-20",
      "hover:bg-current",
      "rounded"
    );
  });

  it("applies correct x icon styling", () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        dismissible={true} 
        onDismiss={mockOnDismiss}
      />
    );
    
    const xIcon = screen.getByTestId("x-icon");
    expect(xIcon).toHaveClass("w-4", "h-4");
  });

  it("handles long error messages", () => {
    const longError = "This is a very long error message that might wrap to multiple lines and should still be displayed correctly";
    render(<ErrorDisplay error={longError} />);
    
    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it("maintains proper layout with icons and text", () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        dismissible={true} 
        onDismiss={mockOnDismiss}
      />
    );
    
    const container = screen.getByTestId("motion-div");
    const innerDiv = container.firstChild as HTMLElement;
    expect(innerDiv).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "gap-2"
    );
  });
});
