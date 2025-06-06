import { render, fireEvent } from "@testing-library/react";
import ArticleForm from "@/components/articles/ArticleForm";
import "@testing-library/jest-dom";

describe("ArticleForm", () => {
  it("calls onSubmit when form is submitted", () => {
    const onSubmit = jest.fn();
    const setFormState = jest.fn();
    const formState = { title: "", content: "", tags: [] as string[] };
    const { container } = render(
      <ArticleForm formState={formState} setFormState={setFormState} onSubmit={onSubmit} />
    );
    fireEvent.submit(container.querySelector("form")!);
    expect(onSubmit).toHaveBeenCalled();
  });
});
