import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WorkWithMePage from "@/app/work-with-me/page";
import "@testing-library/jest-dom";

// Mock hooks
const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock Next.js Image
jest.mock("next/image", () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />;
    },
}));

describe("WorkWithMePage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the form correctly", () => {
        render(<WorkWithMePage />);
        expect(screen.getByText(/Let's Build Something Amazing/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Timeline & Requirements/i)).toBeInTheDocument();
    });

    it("renders the privacy policy link", () => {
        render(<WorkWithMePage />);
        const privacyLink = screen.getByText("Privacy Policy");
        expect(privacyLink).toBeInTheDocument();
        expect(privacyLink).toHaveAttribute("href", "/privacy");
    });

    it("validates form inputs", async () => {
        render(<WorkWithMePage />);

        // Submit empty form
        fireEvent.click(screen.getByRole("button", { name: /Submit Request/i }));

        await waitFor(() => {
            expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
        });
    });

    it("submits the form successfully", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        render(<WorkWithMePage />);

        fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByLabelText(/Project Title/i), { target: { value: "My Project" } });
        fireEvent.change(screen.getByLabelText(/Timeline & Requirements/i), { target: { value: "This is a detailed description of the project requirements." } });

        fireEvent.click(screen.getByRole("button", { name: /Submit Request/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/work-with-me", expect.any(Object));
            expect(screen.getByText(/Request Received!/i)).toBeInTheDocument();
        });
    });

    it("handles submission error", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Failed to submit" }),
        });

        render(<WorkWithMePage />);

        fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByLabelText(/Project Title/i), { target: { value: "My Project" } });
        fireEvent.change(screen.getByLabelText(/Timeline & Requirements/i), { target: { value: "This is a detailed description of the project requirements." } });

        fireEvent.click(screen.getByRole("button", { name: /Submit Request/i }));

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                variant: "destructive",
                title: "Error",
            }));
        });
    });
});
