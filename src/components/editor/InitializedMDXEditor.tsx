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
import { useTheme } from 'next-themes';
import { AlignmentTools } from './AlignmentTools';

// This is the component that will be dynamically imported
export default function InitializedMDXEditor({
    editorRef,
    articleId,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null, articleId?: string } & MDXEditorProps) {



    // Image upload handler
    const imageUploadHandler = async (image: File) => {
        const formData = new FormData();
        formData.append('file', image);
        // Ensure articleId is present, or handle accordingly (e.g., upload to a temp folder if creating new)
        if (articleId) {
            formData.append('articleId', articleId);
        } else {
            // Fallback or error if no ID. For new articles, we might need a temp ID or just handle in backend.
            // Given the form logic, we should have an ID or handle it. 
            // Ideally the parent creates an ID before editing.
            // For now, let's assume articleId might be missing for new drafts and handle gracefully? 
            // Actually, the API requires articleId. 
            // If we are in "create new" mode, we might not have an ID yet. 
            // But let's restore the basic functionality first. 
            console.error("No articleId for image upload");
            // We could generate a temp ID here or prompt user? 
            // For now, let's try to pass 'temp' or similar if undefined, 
            // OR just let the API error out if it needs strict ID.
            // The previous implementation likely required it.
            formData.append('articleId', articleId || 'temp-upload');
        }

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const json = await response.json();
        return json.url;
    };


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
                            <AlignmentTools editorRef={editorRef as React.MutableRefObject<MDXEditorMethods | null>} />
                            <InsertImage />
                        </DiffSourceToggleWrapper>
                    ),
                }),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
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