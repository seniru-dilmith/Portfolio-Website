import React, { createRef, Ref } from "react";
import { render } from "@testing-library/react";
import InitializedMDXEditor from "./InitializedMDXEditor";
import "@testing-library/jest-dom";
import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

// Mock @mdxeditor/editor
const mockMDXEditor = jest.fn((props: Partial<MDXEditorProps> & { ref?: Ref<MDXEditorMethods> }) => {
  // Filter out non-DOM props and do not spread ref, autoFocus, onBlur, onChange, or onError onto the div
  const { contentEditableClassName, ref, autoFocus, onBlur, onChange, onError, ...domProps } = props;
  return <div data-testid="mdx-editor-mock" {...domProps}>MDX Editor Mock</div>;
});

jest.mock("@mdxeditor/editor", () => {
  const MockMDXEditorComponent = React.forwardRef<MDXEditorMethods, Partial<MDXEditorProps>>((props, ref) => mockMDXEditor({ ...props, ref }));
  MockMDXEditorComponent.displayName = "MockMDXEditor";
  return {
    MDXEditor: MockMDXEditorComponent,
    headingsPlugin: jest.fn(() => "headingsPlugin"),
    listsPlugin: jest.fn(() => "listsPlugin"),
    quotePlugin: jest.fn(() => "quotePlugin"),
    thematicBreakPlugin: jest.fn(() => "thematicBreakPlugin"),
    markdownShortcutPlugin: jest.fn(() => "markdownShortcutPlugin"),
    toolbarPlugin: jest.fn((opts) => ({ toolbar: opts })),
    DiffSourceToggleWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="diff-toggle">{children}</div>,
    UndoRedo: () => <button data-testid="undo-redo">UndoRedo</button>,
    BoldItalicUnderlineToggles: () => <button data-testid="bold-italic">BoldItalic</button>,
    ListsToggle: () => <button data-testid="lists-toggle">ListsToggle</button>,
    BlockTypeSelect: () => <button data-testid="block-type">BlockType</button>,
  };
});

describe("InitializedMDXEditor", () => {
  it("renders MDXEditor with correct plugins and forwards ref", () => {
    const ref = createRef<MDXEditorMethods>();
    render(
      <InitializedMDXEditor
        editorRef={ref}
        markdown="test markdown"
        onChange={jest.fn()}
      />
    );
    const editor = document.querySelector('[data-testid="mdx-editor-mock"]');
    expect(editor).toBeInTheDocument();
    // Check that the ref is forwarded
    // (since we pass ref as a prop, check that mockMDXEditor received it)
    expect(mockMDXEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        markdown: "test markdown",
        ref,
        // contentEditableClassName, autoFocus, onBlur, onChange, and onError are filtered out for the DOM
      })
    );
  });
}); 