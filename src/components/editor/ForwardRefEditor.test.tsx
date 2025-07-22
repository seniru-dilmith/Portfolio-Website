import React, { createRef, forwardRef, RefObject } from "react";
import { render } from "@testing-library/react";
import { ForwardRefEditor } from "./ForwardRefEditor";
import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import "@testing-library/jest-dom";

// Capture props and ref for assertion
let receivedProps: Partial<MDXEditorProps> | null = null;
let receivedRef: RefObject<MDXEditorMethods> | null = null;

// Mock next/dynamic to return a mock editor component
jest.mock("next/dynamic", () => () => {
  const MockEditor = forwardRef<MDXEditorMethods, Partial<MDXEditorProps>>((props, ref) => {
    receivedProps = props;
    receivedRef = ref as RefObject<MDXEditorMethods>;
    return <div data-testid="mock-editor">Mock Editor</div>;
  });
  MockEditor.displayName = "MockEditor";
  return MockEditor;
});

describe("ForwardRefEditor", () => {
  beforeEach(() => {
    receivedProps = null;
    receivedRef = null;
  });

  it("forwards markdown prop and receives a ref in the dynamic editor", () => {
    const ref = createRef<MDXEditorMethods>();
    render(<ForwardRefEditor markdown="test-markdown" ref={ref} />);
    // Props should be forwarded
    expect(receivedProps?.markdown).toBe("test-markdown");
    // Ref should be received (not undefined)
    expect(receivedRef).not.toBeUndefined();
  });
}); 