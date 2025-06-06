import { render } from "@testing-library/react";
import AnimatedSection from "@/components/AnimatedSection";
import "@testing-library/jest-dom";

describe("AnimatedSection", () => {
  it("renders children", () => {
    const { getByText } = render(
      <AnimatedSection>
        <div>Child</div>
      </AnimatedSection>
    );
    expect(getByText("Child")).toBeInTheDocument();
  });
});
