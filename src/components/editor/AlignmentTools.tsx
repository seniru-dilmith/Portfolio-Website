import React from 'react';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface AlignmentToolsProps {
    editorRef: React.MutableRefObject<MDXEditorMethods | null>;
}

export const AlignmentTools: React.FC<AlignmentToolsProps> = ({ editorRef }) => {
    const insertAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
        // Prevent accidental replacement of selected text
        const selection = window.getSelection();
        if (selection && selection.type === 'Range' && !selection.isCollapsed) {
            alert("Please place your cursor at the end of the paragraph/block to align it, rather than selecting the text.");
            return;
        }

        const suffix = ` #${align}`;
        editorRef.current?.insertMarkdown(suffix);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent button from stealing focus
    };

    return (
        <div className="flex gap-1 border-l pl-2 ml-2 border-border/50">
            <button
                type="button"
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => insertAlignment('left')}
                onMouseDown={handleMouseDown}
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                type="button"
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => insertAlignment('center')}
                onMouseDown={handleMouseDown}
                title="Align Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                type="button"
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => insertAlignment('right')}
                onMouseDown={handleMouseDown}
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>
            <button
                type="button"
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => insertAlignment('justify')}
                onMouseDown={handleMouseDown}
                title="Align Justify"
            >
                <AlignJustify className="w-4 h-4" />
            </button>
        </div>
    );
};
