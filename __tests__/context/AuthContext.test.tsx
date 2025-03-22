import { render, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const TestComponent = () => {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "LoggedIn" : "LoggedOut"}</div>
      <button onClick={() => handleLogin("dummy-token")}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  it("updates auth state correctly", () => {
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

    act(() => {
      getByText("Logout").click();
    });
    expect(getByTestId("auth-status").textContent).toBe("LoggedOut");
  });
});
