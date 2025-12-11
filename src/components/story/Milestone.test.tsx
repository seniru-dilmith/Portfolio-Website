import React from "react";
import { render, screen } from "@testing-library/react";
import Milestone from "@/components/story/Milestone";
import "@testing-library/jest-dom";

// Mock framer-motion and hooks
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      whileHover,
      ...props
    }: React.PropsWithChildren<{
      whileHover?: Record<string, unknown>;
      className?: string;
      [key: string]: unknown;
    }>) => (
      <div data-testid="animated-div" data-while-hover={JSON.stringify(whileHover)} {...props}>
        {children}
      </div>
    ),
    h2: ({
      children,
      ...props
    }: React.PropsWithChildren<{
      className?: string;
      [key: string]: unknown;
    }>) => (
      <h2 data-testid="animated-heading" {...props}>
        {children}
      </h2>
    ),
    p: ({
      children,
      ...props
    }: React.PropsWithChildren<{
      className?: string;
      [key: string]: unknown;
    }>) => (
      <p data-testid="animated-paragraph" {...props}>
        {children}
      </p>
    ),
  },
  useAnimation: () => ({
    start: jest.fn(),
  }),
}));

// Mock react-intersection-observer
jest.mock("react-intersection-observer", () => ({
  useInView: () => [jest.fn(), true],
}));

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    priority?: boolean;
    width?: number;
    height?: number;
    className?: string;
    [key: string]: unknown;
  }) {
    return (
      <div
        role="img"
        aria-label={alt}
        data-alt={alt}
        data-src={src}
        data-testid="next-image"
        data-priority={priority}
        {...props}
      />
    );
  };
});

describe("Milestone", () => {
  const mockMilestone = {
    title: "Test Milestone Title",
    date: "January 2023",
    description: "This is a test milestone description that explains what happened during this important event.",
    image: "/test/milestone-image.jpg",
  };

  it("renders milestone title", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    expect(screen.getByText("Test Milestone Title")).toBeInTheDocument();
    expect(screen.getByText("Test Milestone Title")).toHaveClass(
      "text-2xl",
      "md:text-3xl",
      "font-bold",
      "mb-2",
      "md:mb-4",
      "text-neutral-content"
    );
  });

  it("renders milestone date", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    expect(screen.getByText("January 2023")).toBeInTheDocument();
    expect(screen.getByText("January 2023")).toHaveClass(
      "text-xs",
      "md:text-sm",
      "font-semibold",
      "mb-2",
      "text-info"
    );
  });

  it("renders milestone description", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    expect(screen.getByText(/This is a test milestone description/)).toBeInTheDocument();
    expect(screen.getByText(/This is a test milestone description/)).toHaveClass(
      "text-sm",
      "md:text-base",
      "text-neutral-content"
    );
  });

  it("renders milestone image with correct props", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "/test/milestone-image.jpg");
    expect(image).toHaveAttribute("data-alt", "Test Milestone Title");
    expect(image).toHaveClass(
      "rounded-lg",
      "shadow-lg",
      "border-2",
      "border-accent",
      "object-cover"
    );
  });

  it("applies correct layout when reverse is false", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    const containerDivs = screen.getAllByTestId("animated-div");

    // Find main container
    const mainContainer = containerDivs.find(div =>
      div.className?.includes("flex") &&
      div.className?.includes("flex-col") &&
      div.className?.includes("lg:flex-row") &&
      !div.className?.includes("lg:flex-row-reverse")
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
    expect(mainContainer).not.toHaveClass("lg:flex-row-reverse");
  });

  it("applies correct layout when reverse is true", () => {
    render(<Milestone milestone={mockMilestone} reverse={true} />);

    const containerDivs = screen.getAllByTestId("animated-div");

    // Find main container with reverse class
    const mainContainer = containerDivs.find(div =>
      div.className?.includes("lg:flex-row-reverse")
    );

    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass("lg:flex-row-reverse");
  });

  it("applies correct content section styling", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    const contentDivs = screen.getAllByTestId("animated-div");

    // Find content section
    const contentSection = contentDivs.find(div =>
      div.className?.includes("w-full") &&
      div.className?.includes("lg:w-1/2") &&
      div.className?.includes("bg-neutral")
    );

    expect(contentSection).toBeInTheDocument();
    expect(contentSection).toHaveClass(
      "w-full",
      "lg:w-1/2",
      "mt-9",
      "p-4",
      "md:p-6",
      "bg-neutral",
      "rounded-lg",
      "shadow-lg"
    );
  });

  it("applies correct image section styling", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    const imageDivs = screen.getAllByTestId("animated-div");

    // Find image container
    const imageContainer = imageDivs.find(div =>
      div.className?.includes("w-[80%]") &&
      div.className?.includes("lg:w-1/2")
    );

    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass(
      "w-[80%]",
      "lg:w-1/2",
      "p-2",
      "md:p-6"
    );
  });

  it("applies correct image aspect ratio classes", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    const imageDivs = screen.getAllByTestId("animated-div");

    // Find image wrapper with aspect ratio
    const imageWrapper = imageDivs.find(div =>
      div.className?.includes("aspect-video") &&
      div.className?.includes("md:aspect-[4/3]") &&
      div.className?.includes("lg:aspect-[16/9]")
    );

    expect(imageWrapper).toBeInTheDocument();
    expect(imageWrapper).toHaveClass(
      "relative",
      "w-full",
      "aspect-video",
      "md:aspect-[4/3]",
      "lg:aspect-[16/9]"
    );
  });

  it("sets image priority based on reverse prop", () => {
    const { rerender } = render(<Milestone milestone={mockMilestone} reverse={true} />);

    let image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-priority", "true");

    rerender(<Milestone milestone={mockMilestone} reverse={false} />);

    image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-priority", "false");
  });

  it("renders proper responsive design classes", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    const title = screen.getByText("Test Milestone Title");
    const date = screen.getByText("January 2023");
    const description = screen.getByText(/This is a test milestone/);

    expect(title).toHaveClass("text-2xl", "md:text-3xl");
    expect(date).toHaveClass("text-xs", "md:text-sm");
    expect(description).toHaveClass("text-sm", "md:text-base");
  });

  it("maintains proper semantic structure", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    // Verify heading structure
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Test Milestone Title");

    // Verify image has proper alt text
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("data-alt", "Test Milestone Title");
  });

  it("handles different milestone data correctly", () => {
    const differentMilestone = {
      title: "Another Milestone",
      date: "December 2022",
      description: "Different description for testing purposes.",
      image: "/different/image.jpg",
    };

    render(<Milestone milestone={differentMilestone} reverse={true} />);

    expect(screen.getByText("Another Milestone")).toBeInTheDocument();
    expect(screen.getByText("December 2022")).toBeInTheDocument();
    expect(screen.getByText("Different description for testing purposes.")).toBeInTheDocument();

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "/different/image.jpg");
    expect(image).toHaveAttribute("data-alt", "Another Milestone");
  });

  it("applies proper spacing and padding classes", () => {
    render(<Milestone milestone={mockMilestone} reverse={false} />);

    const contentSection = screen.getAllByTestId("animated-div").find(div =>
      div.className?.includes("p-4") && div.className?.includes("md:p-6")
    );

    const imageSection = screen.getAllByTestId("animated-div").find(div =>
      div.className?.includes("p-2") && div.className?.includes("md:p-6")
    );

    expect(contentSection).toHaveClass("p-4", "md:p-6");
    expect(imageSection).toHaveClass("p-2", "md:p-6");
  });
});
