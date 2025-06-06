import { render, screen } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import ArticleList from "@/components/articles/ArticleList";
import "@testing-library/jest-dom";

const articles = [
  { _id: "1", title: "A1", content: "C1", tags: [] },
  { _id: "2", title: "A2", content: "C2", tags: [] },
];

const renderList = (isAuthenticated = false) =>
  render(
    <AuthContext.Provider value={{ isAuthenticated, handleLogin: jest.fn(), handleLogout: jest.fn() }}>
      <ArticleList articles={articles} onEdit={jest.fn()} onDelete={jest.fn()} />
    </AuthContext.Provider>
  );

describe("ArticleList", () => {
  it("renders article titles", () => {
    renderList();
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
  });

  it("shows edit/delete buttons when authenticated", () => {
    renderList(true);
    expect(screen.getAllByText("Edit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Delete").length).toBeGreaterThan(0);
  });
});
