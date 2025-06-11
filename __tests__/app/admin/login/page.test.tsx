import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/admin/login/page";
import "@testing-library/jest-dom";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Next.js navigation
const mockPush = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: mockUsePathname,
}));

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock Next.js Head
jest.mock("next/head", () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

// Mock UI components
jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: { children: React.ReactNode; htmlFor?: string }) => (
    <label {...props}>{children}</label>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

import { useAuth } from "@/context/AuthContext";

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUsePathname.mockReturnValue("/admin/login");
    
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      signOut: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    render(<LoginPage />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders login form with email and password fields", () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("updates input values when typing", () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("handles successful login", async () => {
    const mockHandleLogin = jest.fn();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockHandleLogin,
      signOut: jest.fn(),
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: { 
        success: true, 
        token: "mock-token",
        user: { id: "1", email: "test@example.com" }
      }
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/admin/login", {
        email: "test@example.com",
        password: "password123"
      });
    });
  });

  it("handles login error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } }
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("shows loading state during login", async () => {
    mockedAxios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
