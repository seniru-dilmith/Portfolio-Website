import { render } from "@testing-library/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import "@testing-library/jest-dom";

describe("LoadingSpinner", () => {
  it("renders svg", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
