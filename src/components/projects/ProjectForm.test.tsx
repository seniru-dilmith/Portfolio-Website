/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectForm from "./ProjectForm";
import { ProjectFormProps } from "@/types/Project";
import "@testing-library/jest-dom";

// Mock next/image with displayName for ESLint compliance
jest.mock("next/image", () => ({
  __esModule: true,
  default: Object.assign(({
    src,
    alt
  }: { src: string; alt: string }) => <img src={src} alt={alt} data-testid="next-image" />, { displayName: "NextImageMock" })
}));

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaPlus: () => <span data-testid="fa-plus">PlusIcon</span>,
  FaTrash: () => <span data-testid="fa-trash">TrashIcon</span>,
}));

const defaultProps: ProjectFormProps = {
  formState: {
    title: "Test Title",
    description: "Test Description",
    technologies: "React, TypeScript",
    links: [
      { name: "GitHub", url: "https://github.com" },
    ],
    imageURLs: ["/img1.png"],
  },
  setFormState: jest.fn(),
  handleAddOrUpdate: jest.fn((e) => e.preventDefault()),
  editingProjectId: null,
  resetForm: jest.fn(),
  handleFileChange: jest.fn(),
  newFiles: [],
  removeNewFile: jest.fn(),
  removeExistingImage: jest.fn(),
  isUploading: false,
  handleLinkChange: jest.fn(),
  addLinkField: jest.fn(),
  removeLinkField: jest.fn(),
};

describe("ProjectForm", () => {
  it("renders all form fields", () => {
    render(<ProjectForm {...defaultProps} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/technologies/i)).toBeInTheDocument();
    expect(screen.getByText(/project links/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project images/i)).toBeInTheDocument();
    expect(screen.getByText(/add another link/i)).toBeInTheDocument();
    expect(screen.getByText(/add project/i)).toBeInTheDocument();
  });

  it("calls setFormState on input change", () => {
    render(<ProjectForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "New Title" } });
    expect(defaultProps.setFormState).toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "New Description" } });
    expect(defaultProps.setFormState).toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/technologies/i), { target: { value: "Vue, Node" } });
    expect(defaultProps.setFormState).toHaveBeenCalled();
  });

  it("calls handleLinkChange and removeLinkField on link input and remove", async () => {
    // Add a second link so the remove button is enabled
    const handleLinkChange = jest.fn();
    const removeLinkField = jest.fn();
    const props = {
      ...defaultProps,
      formState: {
        ...defaultProps.formState,
        links: [
          { name: "GitHub", url: "https://github.com" },
          { name: "Demo", url: "https://demo.com" },
        ],
      },
      handleLinkChange,
      removeLinkField,
    };
    render(<ProjectForm {...props} />);
    const user = userEvent.setup();
    await user.type(screen.getAllByPlaceholderText(/link name/i)[1], "Demo");
    expect(handleLinkChange).toHaveBeenCalled();
    await user.type(screen.getAllByPlaceholderText(/https:\/\//i)[1], "https://demo.com");
    expect(handleLinkChange).toHaveBeenCalled();
    fireEvent.click(screen.getAllByLabelText(/remove link/i)[1]);
    expect(removeLinkField).toHaveBeenCalled();
  });

  it("calls addLinkField when add another link is clicked", () => {
    render(<ProjectForm {...defaultProps} />);
    fireEvent.click(screen.getByText(/add another link/i));
    expect(defaultProps.addLinkField).toHaveBeenCalled();
  });

  it("calls handleFileChange on file input change", () => {
    render(<ProjectForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/project images/i), { target: { files: [new File([""], "test.png", { type: "image/png" })] } });
    expect(defaultProps.handleFileChange).toHaveBeenCalled();
  });

  it("renders image previews for existing images", () => {
    render(<ProjectForm {...defaultProps} />);
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
  });

  it("renders progress bar and disables form when uploading", () => {
    render(<ProjectForm {...defaultProps} isUploading={true} />);
    expect(screen.getByText(/processing, please wait/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    // The button text changes to 'Processing...' when uploading
    expect(screen.getByRole("button", { name: /processing/i })).toBeDisabled();
  });

  it("renders cancel button if editing", () => {
    render(<ProjectForm {...defaultProps} editingProjectId="123" />);
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
}); 