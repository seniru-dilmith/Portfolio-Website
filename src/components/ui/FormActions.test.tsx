import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormActions from "@/components/ui/FormActions";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    button: ({ children, className, onClick, whileHover, whileTap, ...props }: React.ComponentProps<'button'> & { whileHover?: object; whileTap?: object }) => (
      <button
        type="button"
        className={className}
        onClick={onClick}
        data-testid="motion-button"
        data-while-hover={JSON.stringify(whileHover)}
        data-while-tap={JSON.stringify(whileTap)}
        {...props}
      >
        {children}
      </button>
    ),
  },
}));

describe("FormActions", () => {
  const mockOnToggleForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when user is authenticated", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    expect(screen.getByTestId("motion-button")).toBeInTheDocument();
  });

  it("does not render when user is not authenticated", () => {
    render(
      <FormActions
        isAuthenticated={false}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    expect(screen.queryByTestId("motion-button")).not.toBeInTheDocument();
  });

  it("displays correct text when form is hidden and not editing", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        isEditing={false}
      />
    );
    
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("displays correct text when form is visible", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={true}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    expect(screen.getByText("Hide Form")).toBeInTheDocument();
  });

  it("displays correct text when editing", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        isEditing={true}
      />
    );
    
    expect(screen.getByText("Edit Item")).toBeInTheDocument();
  });

  it("uses custom text props", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        addText="Create New"
        editText="Modify Item"
        hideText="Close Form"
      />
    );
    
    expect(screen.getByText("Create New")).toBeInTheDocument();
  });

  it("shows custom edit text when editing", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        isEditing={true}
        editText="Update Record"
      />
    );
    
    expect(screen.getByText("Update Record")).toBeInTheDocument();
  });

  it("shows custom hide text when form is visible", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={true}
        onToggleForm={mockOnToggleForm}
        hideText="Cancel"
      />
    );
    
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onToggleForm when button is clicked", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    const button = screen.getByTestId("motion-button");
    fireEvent.click(button);
    
    expect(mockOnToggleForm).toHaveBeenCalledTimes(1);
  });

  it("applies default container classes", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    const container = screen.getByTestId("motion-button").parentElement;
    expect(container).toHaveClass(
      "flex",
      "justify-between",
      "items-center",
      "mb-6"
    );
  });

  it("applies custom container className", () => {
    const customClass = "custom-container-class";
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        className={customClass}
      />
    );
    
    const container = screen.getByTestId("motion-button").parentElement;
    expect(container).toHaveClass(customClass);
  });

  it("applies default button classes", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    const button = screen.getByTestId("motion-button");
    expect(button).toHaveClass("btn", "btn-primary", "shadow-lg");
  });

  it("applies custom button className", () => {
    const customButtonClass = "custom-btn-class";
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        buttonClassName={customButtonClass}
      />
    );
    
    const button = screen.getByTestId("motion-button");
    expect(button).toHaveClass(customButtonClass);
  });

  it("configures hover and tap animations", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    const button = screen.getByTestId("motion-button");
    const hoverData = JSON.parse(button.getAttribute("data-while-hover") || "{}");
    const tapData = JSON.parse(button.getAttribute("data-while-tap") || "{}");
    
    expect(hoverData.scale).toBe(1.05);
    expect(tapData.scale).toBe(0.95);
  });

  it("handles multiple state changes correctly", () => {
    const { rerender } = render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        isEditing={false}
      />
    );
    
    expect(screen.getByText("Add Item")).toBeInTheDocument();
    
    rerender(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
        isEditing={true}
      />
    );
    
    expect(screen.getByText("Edit Item")).toBeInTheDocument();
    
    rerender(
      <FormActions
        isAuthenticated={true}
        viewForm={true}
        onToggleForm={mockOnToggleForm}
        isEditing={true}
      />
    );
    
    expect(screen.getByText("Hide Form")).toBeInTheDocument();
  });

  it("maintains accessibility", () => {
    render(
      <FormActions
        isAuthenticated={true}
        viewForm={false}
        onToggleForm={mockOnToggleForm}
      />
    );
    
    const button = screen.getByTestId("motion-button");
    expect(button).toHaveAttribute("type", "button");
  });
});
