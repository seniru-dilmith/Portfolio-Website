import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SubscriptionPage from "@/app/pricing/page";
import "@testing-library/jest-dom";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock framer-motion
jest.mock("framer-motion", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createMock = (Component: string) => (props: any) => {
    // Extract the standard props we need
    const { children, className, onClick, onSubmit } = props;
    
    // Create the props object with only the allowed props
    const safeProps: Record<string, unknown> = {};
    if (className) safeProps.className = className;
    if (onClick) safeProps.onClick = onClick;
    if (onSubmit) safeProps.onSubmit = onSubmit;
    
    // Create the appropriate element type
    switch (Component) {
      case 'div': return <div {...safeProps}>{children}</div>;
      case 'h1': return <h1 {...safeProps}>{children}</h1>;
      case 'h2': return <h2 {...safeProps}>{children}</h2>;
      case 'p': return <p {...safeProps}>{children}</p>;
      case 'form': return <form {...safeProps}>{children}</form>;
      case 'input': return <input {...safeProps} />;
      case 'button': return <button {...safeProps}>{children}</button>;
      default: return <div {...safeProps}>{children}</div>;
    }
  };
  
  return {
    motion: {
      div: createMock('div'),
      h1: createMock('h1'),
      h2: createMock('h2'),
      p: createMock('p'),
      form: createMock('form'),
      input: createMock('input'),
      button: createMock('button'),
    },
  };
});

// Mock Next.js components
jest.mock("next/link", () => {
  return function MockLink({ 
    href, 
    children 
  }: { 
    href: string; 
    children: React.ReactNode; 
  }) {
    return <a href={href} data-testid={`link-${href}`}>{children}</a>;
  };
});

jest.mock("next/head", () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

// Mock Footer component
jest.mock("@/components/footer/Footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

describe("SubscriptionPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<SubscriptionPage />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders subscription form", () => {
    render(<SubscriptionPage />);
    
    const emailInput = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    
    expect(emailInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("handles successful subscription", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true }
    });

    render(<SubscriptionPage />);
    
    const emailInput = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/subscribe", {
        email: "test@example.com"
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/subscription successful/i)).toBeInTheDocument();
    });
  });

  it("handles subscription error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "An error occurred"
        }
      }
    });

    render(<SubscriptionPage />);
    
    const emailInput = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // The actual error message in the component might be different
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    });
  });

  it("clears email input after successful subscription", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true }
    });

    render(<SubscriptionPage />);
    
    const emailInput = screen.getByRole("textbox") as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput.value).toBe("");
    });
  });
});
