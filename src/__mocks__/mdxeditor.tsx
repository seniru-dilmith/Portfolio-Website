
import React, { ForwardedRef } from 'react';

export const MDXEditor = React.forwardRef((props: any, ref: ForwardedRef<any>) => {
    return <div data-testid="mdx-editor-mock">MDXEditor Mock</div>;
});
MDXEditor.displayName = 'MDXEditor';

export const headingsPlugin = () => 'headingsPlugin';
export const listsPlugin = () => 'listsPlugin';
export const quotePlugin = () => 'quotePlugin';
export const thematicBreakPlugin = () => 'thematicBreakPlugin';
export const markdownShortcutPlugin = () => 'markdownShortcutPlugin';
export const toolbarPlugin = () => 'toolbarPlugin';
export const imagePlugin = () => 'imagePlugin';
export const diffSourcePlugin = () => 'diffSourcePlugin';
export const jsxPlugin = () => 'jsxPlugin';

export const UndoRedo = () => <div>UndoRedo</div>;
export const BoldItalicUnderlineToggles = () => <div>BoldItalicUnderlineToggles</div>;
export const ListsToggle = () => <div>ListsToggle</div>;
export const BlockTypeSelect = () => <div>BlockTypeSelect</div>;
export const InsertImage = () => <div>InsertImage</div>;
export const DiffSourceToggleWrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
