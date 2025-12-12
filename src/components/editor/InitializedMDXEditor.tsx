'use client';

import type { ForwardedRef } from 'react';
import {
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    imagePlugin,
    DiffSourceToggleWrapper,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    BlockTypeSelect,
    InsertImage,
    diffSourcePlugin,
    jsxPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'; // Required styles
import '@/styles/mdx-editor-theme.css'; // Custom Theme Overrides
import { compressAndConvertToJpg } from '@/util/imageUtils';
import { useTheme } from 'next-themes';

// This is the component that will be dynamically imported
export default function InitializedMDXEditor({
    editorRef,
    articleId,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null, articleId?: string } & MDXEditorProps) {

    async function imageUploadHandler(image: File): Promise<string> {
        if (!articleId) {
            alert("Please save the article first before uploading images.");
            throw new Error("Article ID is required for image upload.");
        }

        try {
            const compressedImage = await compressAndConvertToJpg(image);

            const formData = new FormData();
            formData.append("file", compressedImage);
            formData.append("articleId", articleId);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            return data.url;
        } catch (error) {
            console.error("Image upload failed:", error);
            throw error;
        }
    }

    return (
        <MDXEditor
            plugins={[
                // Add a toolbar with essential tools
                toolbarPlugin({
                    toolbarContents: () => (
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <ListsToggle />
                            <BlockTypeSelect />
                            <InsertImage />
                        </DiffSourceToggleWrapper>
                    ),
                }),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                imagePlugin({ imageUploadHandler }),
                diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'previous-markdown' }),
                jsxPlugin(),
            ]}
            {...props}
            ref={editorRef}
            // Add a class to style the content area
            contentEditableClassName="prose prose-lg dark:prose-invert max-w-none mdxeditor-content"
        />
    );
}