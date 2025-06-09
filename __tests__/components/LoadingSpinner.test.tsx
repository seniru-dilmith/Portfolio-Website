import React from "react";
import { render } from "@testing-library/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    svg: ({ children, className, viewBox, ...props }: React.SVGAttributes<SVGSVGElement>) => (
      <svg className={className} viewBox={viewBox} {...props}>
        {children}
      </svg>
    ),
    circle: ({ ...props }: React.SVGAttributes<SVGCircleElement>) => (
      <circle {...props} />
    ),
  },
}));

describe("LoadingSpinner", () => {
  it("renders svg spinner", () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has correct viewBox and dimensions", () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 50 50");
    expect(svg).toHaveClass("w-16", "h-16");
  });

  it("contains a circle element", () => {
    const { container } = render(<LoadingSpinner />);
    const circle = container.querySelector("circle");
    expect(circle).toBeInTheDocument();
  });
  it("circle has correct attributes", () => {
    const { container } = render(<LoadingSpinner />);
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("cx", "25");
    expect(circle).toHaveAttribute("cy", "25");
    expect(circle).toHaveAttribute("r", "20");
    expect(circle).toHaveAttribute("stroke-width", "5");
    expect(circle).toHaveAttribute("stroke-dasharray", "90 50");
    expect(circle).toHaveAttribute("stroke-linecap", "round");
  });

  it("has proper styling classes", () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "justify-center", "items-center", "h-64");
    
    const circle = container.querySelector("circle");
    expect(circle).toHaveClass("text-primary");
  });
});
