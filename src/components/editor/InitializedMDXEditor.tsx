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
                imagePlugin(),
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