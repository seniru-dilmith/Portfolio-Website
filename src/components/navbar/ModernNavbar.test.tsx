import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/navbar/ModernNavbar";
import { AuthContext } from "@/context/AuthContext";
import { titleNames } from "@/components/navbar/titles";
import "@testing-library/jest-dom";



// Mock usePathname from next/navigation
jest.mock("next/navigation", () => ({
    usePathname: jest.fn().mockReturnValue("/"),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe("Navbar", () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
        mockLogout.mockClear();
    });

    const renderNavbar = (isAuthenticated = false) => {
        render(
            <AuthContext.Provider value={{ isAuthenticated, handleLogin: jest.fn(), handleLogout: mockLogout }}>
                <Navbar />
            </AuthContext.Provider>
        );
    };

    it("renders the navbar with all title links", () => {
        renderNavbar();
        titleNames.forEach((title) => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });
    });

    it("shows the ThemeToggle components", async () => {
        renderNavbar();
        // Theme toggle might be dynamic or lazy
        expect(screen.getAllByText("Toggle theme")).toHaveLength(2);
    });

    it("displays Logout when authenticated", () => {
        renderNavbar(true);
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("calls handleLogout on logout click", () => {
        renderNavbar(true);
        fireEvent.click(screen.getByText("Logout"));
        expect(mockLogout).toHaveBeenCalled();
    });

    it("toggles mobile menu when hamburger is clicked", async () => {
        renderNavbar();

        const menuButton = screen.getByText("Toggle menu");
        fireEvent.click(menuButton);

        // After clicking, menu should be open and have close label
        expect(await screen.findByText("Close")).toBeInTheDocument();
    });


});
