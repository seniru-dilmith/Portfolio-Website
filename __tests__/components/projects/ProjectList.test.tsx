import { render, screen } from "@testing-library/react";
import ProjectList from "@/components/projects/ProjectList";
import "@testing-library/jest-dom";

const projects = [
  {
    _id: "1",
    title: "P1",
    description: "D1",
    technologies: ["React"],
    githubURL: "#",
  },
];

describe("ProjectList", () => {
  it("renders project titles", () => {
    render(
      <ProjectList projects={projects} handleEdit={jest.fn()} handleDelete={jest.fn()} isAuthenticated={false} />
    );
    expect(screen.getByText("P1")).toBeInTheDocument();
  });
});
