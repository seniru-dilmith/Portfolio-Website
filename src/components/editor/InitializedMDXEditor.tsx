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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/util/firebaseServer';
import { compressAndConvertToJpg } from '@/util/imageUtils';
import { v4 as uuidv4 } from 'uuid';
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
            // The folder name in the storage bucket should be the article id.
            // So path should be `${articleId}/${filename}`.

            const storageRef = ref(storage, `${articleId}/${uuidv4()}.jpg`);

            await uploadBytes(storageRef, compressedImage);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
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