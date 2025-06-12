import React from "react";
import { render, screen } from "@testing-library/react";
import Story from "@/app/story/page";
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

// Mock components
jest.mock("@/components/story/UpperImageSection", () => {
  return function MockUpperImageSection() {
    return <div data-testid="upper-image-section">Upper Image Section</div>;
  };
});

jest.mock("@/components/story/MilestoneList", () => {
  return function MockMilestoneList() {
    return <div data-testid="milestone-list">Milestone List</div>;
  };
});

jest.mock("@/components/story/MyStory", () => {
  return function MockAboutMe() {
    return <div data-testid="about-me">About Me</div>;
  };
});

jest.mock("@/components/story/JorneyConinues", () => {
  return function MockJourneyContinues() {
    return <div data-testid="journey-continues">Journey Continues</div>;
  };
});

jest.mock("@/components/layout/PageLayout", () => {
  return function MockPageLayout({ 
    children, 
    title, 
    description 
  }: { 
    children: React.ReactNode; 
    title?: string; 
    description?: string; 
  }) {
    return (
      <div data-testid="page-layout" data-title={title} data-description={description}>
        {children}
      </div>
    );
  };
});

jest.mock("@/constants/pageConfigs", () => ({
  getPageConfig: jest.fn(),
}));

jest.mock("@/components/story/animations", () => ({
  containerVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  bounceIn: {
    hidden: { scale: 0.8 },
    visible: { scale: 1 }
  }
}));

import { getPageConfig } from "@/constants/pageConfigs";

const mockGetPageConfig = getPageConfig as jest.MockedFunction<typeof getPageConfig>;

describe("Story Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGetPageConfig.mockReturnValue({
      title: "My Story",
      description: "Learn about my journey",
      keywords: "story",
      ogUrl: "https://example.com/story",
      svgTheme: "nature",
      floatingSvgPaths: []
    });
  });

  it("renders without crashing", () => {
    render(<Story />);
    expect(screen.getByTestId("page-layout")).toBeInTheDocument();
  });

  it("renders all story components", () => {
    render(<Story />);
    
    expect(screen.getByTestId("upper-image-section")).toBeInTheDocument();
    expect(screen.getByTestId("milestone-list")).toBeInTheDocument();
    expect(screen.getByTestId("about-me")).toBeInTheDocument();
    expect(screen.getByTestId("journey-continues")).toBeInTheDocument();
  });

  it("uses correct page configuration", () => {
    render(<Story />);
    
    expect(mockGetPageConfig).toHaveBeenCalledWith('story');
    
    const pageLayout = screen.getByTestId("page-layout");
    expect(pageLayout).toHaveAttribute("data-title", "My Story");
    expect(pageLayout).toHaveAttribute("data-description", "Learn about my journey");
  });

  it("has correct container structure", () => {
    const { container } = render(<Story />);
    
    const storyContainer = container.querySelector('.container');
    expect(storyContainer).toBeInTheDocument();
    expect(storyContainer).toHaveClass('mx-auto');
    expect(storyContainer).toHaveClass('py-8');
  });
});
