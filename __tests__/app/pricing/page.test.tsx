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
  const createMock = (Component: string) => {
    type MockProps = {
      children?: React.ReactNode;
      className?: string;
      onClick?: () => void;
      [key: string]: unknown;
    };

    const MockComponent = (props: MockProps) => {
      const { children, ...rest } = props;
      // Pass all props through to keep component behaviour intact
      switch (Component) {
        case "div":
          return <div {...rest}>{children}</div>;
        case "h1":
          return <h1 {...rest}>{children}</h1>;
        case "h2":
          return <h2 {...rest}>{children}</h2>;
        case "p":
          return <p {...rest}>{children}</p>;
        case "form":
          return <form {...rest}>{children}</form>;
        case "input":
          return <input {...rest} />;
        case "button":
          return <button {...rest}>{children}</button>;
        default:
          return <div {...rest}>{children}</div>;
      }
    };
    MockComponent.displayName = `Motion${Component.charAt(0).toUpperCase() + Component.slice(1)}`;
    return MockComponent;
  };

  return {
    motion: {
      div: createMock("div"),
      h1: createMock("h1"),
      h2: createMock("h2"),
      p: createMock("p"),
      form: createMock("form"),
      input: createMock("input"),
      button: createMock("button"),
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
