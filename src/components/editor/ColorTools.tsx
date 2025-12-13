import React from 'react';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { Palette } from 'lucide-react';

interface ColorToolsProps {
    editorRef: React.MutableRefObject<MDXEditorMethods | null>;
}

export const ColorTools: React.FC<ColorToolsProps> = ({ editorRef }) => {
    const insertColor = (colorName: string) => {
        const selectedText = window.getSelection()?.toString();
        if (selectedText) {
            editorRef.current?.insertMarkdown(`<span className="text-${colorName}">${selectedText}</span>`);
        } else {
            // If nothing selected, maybe just insert an example or do nothing (safer)
            // Or insert the span with empty text? Better to warn.
            // But for now, let's assume usage on selection.
        }
    };

    const colors = [
        { name: 'red', hex: '#ef4444' },
        { name: 'blue', hex: '#3b82f6' },
        { name: 'green', hex: '#22c55e' },
        { name: 'yellow', hex: '#eab308' },
        { name: 'purple', hex: '#a855f7' },
    ];

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-1 border-l pl-2 ml-2 border-border/50 items-center">
            <div className="group relative flex items-center">
                <Palette className="w-4 h-4 text-muted-foreground mr-1" />
                <div className="flex gap-1">
                    {colors.map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            className="w-4 h-4 rounded-full border border-border/50 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.hex }}
                            onClick={() => insertColor(c.name)}
                            onMouseDown={handleMouseDown}
                            title={`Color ${c.name}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
