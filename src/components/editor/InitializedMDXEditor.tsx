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
    DiffSourceToggleWrapper,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    BlockTypeSelect,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'; // Required styles

// This is the component that will be dynamically imported
export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
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
                        </DiffSourceToggleWrapper>
                    ),
                }),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
            ]}
            {...props}
            ref={editorRef}
            // Add a class to style the content area
            contentEditableClassName="prose prose-lg"
        />
    );
}