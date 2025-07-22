import { render, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Mock fetch for API calls
global.fetch = jest.fn();

const TestComponent = () => {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "LoggedIn" : "LoggedOut"}</div>
      <button onClick={() => handleLogin()}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorage.clear();
  });

  it("starts with unauthenticated state", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId("auth-status").textContent).toBe("LoggedOut");
  });

  it("updates auth state on login", () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId("auth-status").textContent).toBe("LoggedOut");

    act(() => {
      getByText("Login").click();
    });
    
    expect(getByTestId("auth-status").textContent).toBe("LoggedIn");
    expect(localStorage.getItem('isAdmin')).toBe('true');
  });

  it("updates auth state on logout", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    act(() => {
      getByText("Login").click();
    });
    expect(getByTestId("auth-status").textContent).toBe("LoggedIn");

    // Then logout
    await act(async () => {
      getByText("Logout").click();
    });

    await waitFor(() => {
      expect(getByTestId("auth-status").textContent).toBe("LoggedOut");
    });

    expect(fetch).toHaveBeenCalledWith('/api/admin/logout', { method: 'POST' });
    expect(localStorage.getItem('isAdmin')).toBeNull();
  });
});
