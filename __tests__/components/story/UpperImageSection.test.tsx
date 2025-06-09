import React from "react";
import { render, screen } from "@testing-library/react";
import UpperImageSection from "@/components/story/UpperImageSection";
import "@testing-library/jest-dom";

// Mock Next.js Image component
interface MockImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: unknown;
}

jest.mock("next/image", () => {
  return function MockImage({ src, alt, className, ...props }: MockImageProps) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        data-testid="mock-image"
        {...props}
      />
    );
  };
});

// Mock framer-motion
interface MockMotionDivProps {
  children?: React.ReactNode;
  className?: string;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, initial, animate, transition, whileHover, ...props }: MockMotionDivProps) => (
      <div
        className={className}
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        data-while-hover={JSON.stringify(whileHover)}
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

describe("UpperImageSection", () => {
  it("renders the image with correct props", () => {
    render(<UpperImageSection />);
    
    const image = screen.getByTestId("mock-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/story/seniru.jpg");
    expect(image).toHaveAttribute("alt", "My Photo");
  });

  it("applies correct image styling", () => {
    render(<UpperImageSection />);
    
    const image = screen.getByTestId("mock-image");
    expect(image).toHaveClass(
      "rounded-lg",
      "shadow-lg",
      "border-8",
      "object-cover"
    );
  });

  it("renders the quote text correctly", () => {
    render(<UpperImageSection />);
    
    const quoteText = screen.getByText(/Your Decisions make what you are/i);
    expect(quoteText).toBeInTheDocument();
  });

  it("renders the subtitle text correctly", () => {
    render(<UpperImageSection />);
    
    const subtitle = screen.getByText("A journey of passion, perseverance, and purpose");
    expect(subtitle).toBeInTheDocument();
  });

  it("configures container hover animation correctly", () => {
    render(<UpperImageSection />);
    
    const motionDivs = screen.getAllByTestId("motion-div");
    const containerDiv = motionDivs[0]; // First motion div is the container
    
    const hoverData = JSON.parse(containerDiv.getAttribute("data-while-hover") || "{}");
    expect(hoverData.scale).toBe(1.05);
    expect(hoverData.transition.duration).toBe(0.4);
  });

  it("configures image container animation correctly", () => {
    render(<UpperImageSection />);
    
    const motionDivs = screen.getAllByTestId("motion-div");
    const imageContainerDiv = motionDivs[1]; // Second motion div is the image container
    
    const initialData = JSON.parse(imageContainerDiv.getAttribute("data-initial") || "{}");
    const animateData = JSON.parse(imageContainerDiv.getAttribute("data-animate") || "{}");
    const transitionData = JSON.parse(imageContainerDiv.getAttribute("data-transition") || "{}");
    
    expect(initialData.opacity).toBe(0);
    expect(initialData.scale).toBe(0.8);
    expect(initialData.x).toBe(50);
    
    expect(animateData.opacity).toBe(1);
    expect(animateData.scale).toBe(1);
    expect(animateData.x).toBe(0);
    
    expect(transitionData.type).toBe("spring");
    expect(transitionData.stiffness).toBe(120);
    expect(transitionData.damping).toBe(12);
    expect(transitionData.delay).toBe(0.5);
  });

  it("configures text animation correctly", () => {
    render(<UpperImageSection />);
    
    const motionDivs = screen.getAllByTestId("motion-div");
    const textDiv = motionDivs[2]; // Third motion div is the text container
    
    const initialData = JSON.parse(textDiv.getAttribute("data-initial") || "{}");
    const animateData = JSON.parse(textDiv.getAttribute("data-animate") || "{}");
    const transitionData = JSON.parse(textDiv.getAttribute("data-transition") || "{}");
    
    expect(initialData.opacity).toBe(0);
    expect(initialData.y).toBe(30);
    
    expect(animateData.opacity).toBe(1);
    expect(animateData.y).toBe(0);
    
    expect(transitionData.delay).toBe(0.8);
    expect(transitionData.duration).toBe(0.6);
    expect(transitionData.ease).toBe("easeOut");
  });

  it("applies correct container styling", () => {
    render(<UpperImageSection />);
    
    const motionDivs = screen.getAllByTestId("motion-div");
    const containerDiv = motionDivs[0];
    
    expect(containerDiv).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "pt-8",
      "mx-auto",
      "sm:pt-8"
    );
  });

  it("applies correct image container styling", () => {
    render(<UpperImageSection />);
    
    const motionDivs = screen.getAllByTestId("motion-div");
    const imageContainerDiv = motionDivs[1];
    
    expect(imageContainerDiv).toHaveClass(
      "relative",
      "w-2/3",
      "md:w-1/3",
      "lg:w-1/4",
      "sm:w-2/3",
      "aspect-square"
    );
  });

  it("applies correct text container styling", () => {
    render(<UpperImageSection />);
    
    const motionDivs = screen.getAllByTestId("motion-div");
    const textDiv = motionDivs[2];
    
    expect(textDiv).toHaveClass(
      "p-10",
      "mt-4",
      "text-center"
    );
  });

  it("applies correct quote styling", () => {
    render(<UpperImageSection />);
    
    const quoteElement = screen.getByText(/Your Decisions make what you are/i);
    expect(quoteElement).toHaveClass(
      "text-2xl",
      "md:text-4xl",
      "font-semibold"
    );
  });

  it("applies correct subtitle styling", () => {
    render(<UpperImageSection />);
    
    const subtitleElement = screen.getByText("A journey of passion, perseverance, and purpose");
    expect(subtitleElement).toHaveClass(
      "text-base",
      "italic",
      "md:text-lg",
      "text-neutral",
      "mt-2"
    );
  });

  it("has proper responsive image sizing", () => {
    render(<UpperImageSection />);
    
    const motionDivs = screen.getAllByTestId("motion-div");
    const imageContainerDiv = motionDivs[1];
    
    // Check responsive width classes
    expect(imageContainerDiv).toHaveClass("w-2/3"); // default
    expect(imageContainerDiv).toHaveClass("md:w-1/3"); // medium screens
    expect(imageContainerDiv).toHaveClass("lg:w-1/4"); // large screens
    expect(imageContainerDiv).toHaveClass("sm:w-2/3"); // small screens
  });

  it("maintains proper text hierarchy", () => {
    render(<UpperImageSection />);
    
    const quote = screen.getByText(/Your Decisions make what you are/i);
    const subtitle = screen.getByText("A journey of passion, perseverance, and purpose");
    
    expect(quote.tagName).toBe("H2");
    expect(subtitle.tagName).toBe("P");
  });

  it("handles image priority and sizes correctly", () => {
    render(<UpperImageSection />);
    
    const image = screen.getByTestId("mock-image");
    expect(image).toHaveAttribute("sizes", "100vw 50vw 33vw");
  });
});
