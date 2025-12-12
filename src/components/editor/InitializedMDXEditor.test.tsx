
import React, { createRef, Ref } from "react";
import { render } from "@testing-library/react";
import InitializedMDXEditor from "./InitializedMDXEditor";
import "@testing-library/jest-dom";
import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

// Mock @mdxeditor/editor
const mockMDXEditor = jest.fn((props: Partial<MDXEditorProps> & { ref?: Ref<MDXEditorMethods> }) => {
  const { contentEditableClassName, ref, autoFocus, onBlur, onChange, onError, ...domProps } = props;
  return <div data-testid="mdx-editor-mock" {...domProps}>MDX Editor Mock</div>;
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

// Mock Firebase
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  getStorage: jest.fn(), // Add getStorage just in case
}));

jest.mock("@/util/firebaseServer", () => ({
  storage: {},
}));

// Mock Image Utils
jest.mock('@/util/imageUtils', () => ({
  compressAndConvertToJpg: jest.fn(),
}));

// Import mocks to inspect calls
import { imagePlugin } from "@mdxeditor/editor";
import { compressAndConvertToJpg } from "@/util/imageUtils";
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';

describe("InitializedMDXEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("imageUploadHandler throws error if articleId is missing", async () => {
    render(<InitializedMDXEditor editorRef={null} markdown="" />);

    // Extract the imageUploadHandler passed to imagePlugin
    expect(imagePlugin).toHaveBeenCalled();
    const pluginCall = (imagePlugin as jest.Mock).mock.calls[0][0];
    const { imageUploadHandler } = pluginCall;

    await expect(imageUploadHandler(new File([''], 'test.png'))).rejects.toThrow("Article ID is required");
  });

  it("imageUploadHandler processes and uploads image if articleId is present", async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
    const mockCompressedFile = new File(['compressed'], 'test.jpg', { type: 'image/jpeg' });
    const mockUrl = "https://firebasestorage.com/test.jpg";

    (compressAndConvertToJpg as jest.Mock).mockResolvedValue(mockCompressedFile);
    (storageRef as jest.Mock).mockReturnValue({}); // Mock ref object
    (uploadBytes as jest.Mock).mockResolvedValue({} as any);
    (getDownloadURL as jest.Mock).mockResolvedValue(mockUrl);

    render(<InitializedMDXEditor editorRef={null} markdown="" articleId="article-123" />);

    const pluginCall = (imagePlugin as jest.Mock).mock.calls[0][0];
    const { imageUploadHandler } = pluginCall;

    const result = await imageUploadHandler(mockFile);

    expect(compressAndConvertToJpg).toHaveBeenCalledWith(mockFile);
    expect(storageRef).toHaveBeenCalledWith(expect.anything(), expect.stringMatching(/article-123\/.*\.jpg/));
    expect(uploadBytes).toHaveBeenCalledWith(expect.anything(), mockCompressedFile);
    expect(result).toBe(mockUrl);
  });
});