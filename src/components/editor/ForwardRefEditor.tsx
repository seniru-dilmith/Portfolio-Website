'use client';

import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor';

// Dynamically import the editor to prevent SSR issues
const Editor = dynamic(() => import('./InitializedMDXEditor'), {
    ssr: false,
});

// Forward the ref to the editor
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps & { articleId?: string }>(
    (props, ref) => <Editor {...props} editorRef={ref} />
);

// Set display name for easier debugging in React DevTools
ForwardRefEditor.displayName = 'ForwardRefEditor';