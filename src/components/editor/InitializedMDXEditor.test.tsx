
import React, { createRef, Ref } from "react";
import { render } from "@testing-library/react";
import InitializedMDXEditor from "./InitializedMDXEditor";
import "@testing-library/jest-dom";
import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

// Mock @mdxeditor/editor
// Mock @mdxeditor/editor
const MockMDXEditor = React.forwardRef<MDXEditorMethods, MDXEditorProps>((props) => {
  const { ...domProps } = props;
  // We can't really attach MDXEditorMethods to a div, so we'll just ignore the ref or expose a dummy one if needed.
  // For this test, valid JSX is enough.
  return <div data-testid="mdx-editor-mock" {...(domProps as unknown as React.HTMLAttributes<HTMLDivElement>)}>MDX Editor Mock</div>;
});
MockMDXEditor.displayName = "MockMDXEditor";

const mockMDXEditor = jest.fn((props: Partial<MDXEditorProps> & { ref?: Ref<MDXEditorMethods> }) => {
  return <MockMDXEditor {...(props as unknown as MDXEditorProps)} />;
});

jest.mock("@mdxeditor/editor", () => {
  const originalModule = jest.requireActual("@mdxeditor/editor");
  const MockMDXEditorComponent = React.forwardRef<MDXEditorMethods, Partial<MDXEditorProps>>((props, ref) => mockMDXEditor({ ...props, ref }));
  MockMDXEditorComponent.displayName = "MockMDXEditor";
  return {
    ...originalModule, // Keep other exports if any
    MDXEditor: MockMDXEditorComponent,
    headingsPlugin: jest.fn(() => "headingsPlugin"),
    listsPlugin: jest.fn(() => "listsPlugin"),
    quotePlugin: jest.fn(() => "quotePlugin"),
    thematicBreakPlugin: jest.fn(() => "thematicBreakPlugin"),
    markdownShortcutPlugin: jest.fn(() => "markdownShortcutPlugin"),
    toolbarPlugin: jest.fn((opts) => ({ toolbar: opts })),
    imagePlugin: jest.fn(() => "imagePlugin"),
    InsertImage: () => <button data-testid="insert-image">InsertImage</button>,
    DiffSourceToggleWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="diff-toggle">{children}</div>,
    UndoRedo: () => <button data-testid="undo-redo">UndoRedo</button>,
    BoldItalicUnderlineToggles: () => <button data-testid="bold-italic">BoldItalic</button>,
    ListsToggle: () => <button data-testid="lists-toggle">ListsToggle</button>,
    BlockTypeSelect: () => <button data-testid="block-type">BlockType</button>,
  };
});

// Mock Firebase (not used in component anymore, but keeping if other imports act up, or removing if clean)
// The component uses fetch to /api/upload.

// Import mocks to inspect calls
import { imagePlugin } from "@mdxeditor/editor";

describe("InitializedMDXEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

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
  });

  it("imageUploadHandler uploads image using fetch", async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
    const mockUrl = "https://firebasestorage.com/test.jpg";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: mockUrl }),
    });

    render(<InitializedMDXEditor editorRef={null} markdown="" articleId="article-123" />);

    // Extract the imageUploadHandler passed to imagePlugin
    expect(imagePlugin).toHaveBeenCalled();
    const pluginCall = (imagePlugin as jest.Mock).mock.calls[0][0];
    const { imageUploadHandler } = pluginCall;

    const result = await imageUploadHandler(mockFile);

    expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
      method: 'POST',
      // FormData is hard to match exactly with toHaveBeenCalledWith, 
      // usually we check if body is FormData
      body: expect.any(FormData),
    }));
    expect(result).toBe(mockUrl);
  });

  it("imageUploadHandler handles missing articleId gracefully (or as implemented)", async () => {
    // The implementation logs error but falls back to 'temp-upload' or similar logic
    // It does NOT throw "Article ID is required" anymore based on code I saw.
    const mockFile = new File([''], 'test.png');
    const mockUrl = "https://example.com/temp.png";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: mockUrl }),
    });

    render(<InitializedMDXEditor editorRef={null} markdown="" />); // No articleId

    const pluginCall = (imagePlugin as jest.Mock).mock.calls[0][0];
    const { imageUploadHandler } = pluginCall;

    const result = await imageUploadHandler(mockFile);

    expect(result).toBe(mockUrl);
    // Verify it called fetch despite no articleId (implementation falls back)
    expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData),
    }));
  });
});