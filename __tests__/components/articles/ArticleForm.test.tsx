import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArticleForm from "@/components/articles/ArticleForm";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    form: ({ children, className, onSubmit, ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
      <form className={className} onSubmit={onSubmit} {...props}>
        {children}
      </form>
    ),
  },
}));

describe("ArticleForm", () => {
  const defaultProps = {
    formState: { title: "", content: "", tags: [] as string[] },
    setFormState: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ArticleForm {...defaultProps} />);
    
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Content")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tags (comma-separated)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("displays current form state values", () => {
    const formState = {
      title: "Test Title",
      content: "Test Content",
      tags: ["React", "Testing"],
    };

    render(<ArticleForm {...defaultProps} formState={formState} />);
    
    expect(screen.getByDisplayValue("Test Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Content")).toBeInTheDocument();
    expect(screen.getByDisplayValue("React, Testing")).toBeInTheDocument();
  });

  it("calls setFormState when title input changes", async () => {
    const user = userEvent.setup();
    const setFormState = jest.fn();
    
    render(<ArticleForm {...defaultProps} setFormState={setFormState} />);
    
    const titleInput = screen.getByPlaceholderText("Title");
    await user.type(titleInput, "New Title");
    
    expect(setFormState).toHaveBeenCalled();
  });

  it("calls setFormState when content textarea changes", async () => {
    const user = userEvent.setup();
    const setFormState = jest.fn();
    
    render(<ArticleForm {...defaultProps} setFormState={setFormState} />);
    
    const contentTextarea = screen.getByPlaceholderText("Content");
    await user.type(contentTextarea, "New Content");
    
    expect(setFormState).toHaveBeenCalled();
  });

  it("calls setFormState when tags input changes", async () => {
    const user = userEvent.setup();
    const setFormState = jest.fn();
    
    render(<ArticleForm {...defaultProps} setFormState={setFormState} />);
    
    const tagsInput = screen.getByPlaceholderText("Tags (comma-separated)");
    await user.type(tagsInput, "React, Testing");
    
    expect(setFormState).toHaveBeenCalled();
  });

  it("calls onSubmit when form is submitted", () => {
    const onSubmit = jest.fn();
    const { container } = render(<ArticleForm {...defaultProps} onSubmit={onSubmit} />);
    
    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("prevents default form submission", () => {
    const onSubmit = jest.fn();
    const { container } = render(<ArticleForm {...defaultProps} onSubmit={onSubmit} />);
    
    const form = container.querySelector("form")!;
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    
    form.dispatchEvent(submitEvent);
    
    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it("has required attributes on form fields", () => {
    render(<ArticleForm {...defaultProps} />);
    
    const titleInput = screen.getByPlaceholderText("Title");
    const contentTextarea = screen.getByPlaceholderText("Content");
    
    expect(titleInput).toHaveAttribute("required");
    expect(contentTextarea).toHaveAttribute("required");
  });
});
