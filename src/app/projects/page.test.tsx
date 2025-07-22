import React from "react";
import { render, screen } from "@testing-library/react";
import Projects from "@/app/projects/page";
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

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock hooks
jest.mock("@/hooks/useProjectManagement", () => ({
  useProjectManagement: jest.fn(),
}));

// Mock components
jest.mock("@/components/projects/ProjectForm", () => {
  return function MockProjectForm() {
    return <div data-testid="project-form">Project Form</div>;
  };
});

jest.mock("@/components/projects/ProjectList", () => {
  return function MockProjectList() {
    return <div data-testid="project-list">Project List</div>;
  };
});

jest.mock("@/components/projects/HeroForProjects", () => {
  return function MockHeroForProjects() {
    return <div data-testid="hero-for-projects">Hero for Projects</div>;
  };
});

jest.mock("@/util/SmallLoadingSpinner", () => {
  return function MockSmallLoadingSpinner() {
    return <div data-testid="small-loading-spinner">Loading...</div>;
  };
});

jest.mock("@/components/layout/PageLayout", () => {
  return function MockPageLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-layout">{children}</div>;
  };
});

jest.mock("@/components/ui/LoadingIndicator", () => {
  return function MockLoadingIndicator() {
    return <div data-testid="loading-indicator">Loading Indicator</div>;
  };
});

jest.mock("@/components/ui/FormActions", () => {
  return function MockFormActions() {
    return <div data-testid="form-actions">Form Actions</div>;
  };
});

jest.mock("@/components/ui/ErrorDisplay", () => {
  return function MockErrorDisplay() {
    return <div data-testid="error-display">Error Display</div>;
  };
});

jest.mock("@/components/ui/Container", () => {
  return function MockContainer({ children }: { children: React.ReactNode }) {
    return <div data-testid="container">{children}</div>;
  };
});

jest.mock("@/constants/pageConfigs", () => ({
  getPageConfig: jest.fn(),
}));

import { useAuth } from "@/context/AuthContext";
import { useProjectManagement } from "@/hooks/useProjectManagement";
import { getPageConfig } from "@/constants/pageConfigs";

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseProjectManagement = useProjectManagement as jest.MockedFunction<typeof useProjectManagement>;
const mockGetPageConfig = getPageConfig as jest.MockedFunction<typeof getPageConfig>;

describe("Projects Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGetPageConfig.mockReturnValue({
      title: "Projects",
      description: "My projects",
      keywords: "projects",
      ogUrl: "https://example.com/projects",
      svgTheme: "tech",
      floatingSvgPaths: []
    });

    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    mockUseProjectManagement.mockReturnValue({
      projects: [],
      loading: false,
      initialLoading: false,
      error: null,
      viewForm: false,
      editingProjectId: null,
      file: null,
      formState: { title: "", description: "", technologies: "", githubURL: "", imageURL: "" },
      setViewForm: jest.fn(),
      setFormState: jest.fn(),
      handleAddOrUpdate: jest.fn(),
      handleDelete: jest.fn(),
      handleEdit: jest.fn(),
      handleFileChange: jest.fn(),
      resetForm: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    render(<Projects />);
    expect(screen.getByTestId("page-layout")).toBeInTheDocument();
  });

  it("renders main components", () => {
    render(<Projects />);
    
    expect(screen.getByTestId("hero-for-projects")).toBeInTheDocument();
    expect(screen.getByTestId("project-list")).toBeInTheDocument();
  });

  it("shows loading indicator when initially loading", () => {
    mockUseProjectManagement.mockReturnValue({
      projects: [],
      loading: false,
      initialLoading: true,
      error: null,
      viewForm: false,
      editingProjectId: null,
      file: null,
      formState: { title: "", description: "", technologies: "", githubURL: "", imageURL: "" },
      setViewForm: jest.fn(),
      setFormState: jest.fn(),
      handleAddOrUpdate: jest.fn(),
      handleDelete: jest.fn(),
      handleEdit: jest.fn(),
      handleFileChange: jest.fn(),
      resetForm: jest.fn(),
    });

    render(<Projects />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("shows error display when there's an error", () => {
    mockUseProjectManagement.mockReturnValue({
      projects: [],
      loading: false,
      initialLoading: false,
      error: "Test error",
      viewForm: false,
      editingProjectId: null,
      file: null,
      formState: { title: "", description: "", technologies: "", githubURL: "", imageURL: "" },
      setViewForm: jest.fn(),
      setFormState: jest.fn(),
      handleAddOrUpdate: jest.fn(),
      handleDelete: jest.fn(),
      handleEdit: jest.fn(),
      handleFileChange: jest.fn(),
      resetForm: jest.fn(),
    });

    render(<Projects />);
    expect(screen.getByTestId("error-display")).toBeInTheDocument();
  });

  it("shows project form when authenticated and viewForm is true", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    mockUseProjectManagement.mockReturnValue({
      projects: [],
      loading: false,
      initialLoading: false,
      error: null,
      viewForm: true,
      editingProjectId: null,
      file: null,
      formState: { title: "", description: "", technologies: "", githubURL: "", imageURL: "" },
      setViewForm: jest.fn(),
      setFormState: jest.fn(),
      handleAddOrUpdate: jest.fn(),
      handleDelete: jest.fn(),
      handleEdit: jest.fn(),
      handleFileChange: jest.fn(),
      resetForm: jest.fn(),
    });

    render(<Projects />);
    expect(screen.getByTestId("project-form")).toBeInTheDocument();
  });
});
