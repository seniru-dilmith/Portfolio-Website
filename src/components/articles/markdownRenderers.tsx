import React from 'react';
import Image from 'next/image';

interface CustomImageRendererProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: unknown;
    alt?: string;
    title?: string;
}

export const CustomImageRenderer = ({ alt, src, title, style, width, height, ...props }: CustomImageRendererProps & { style?: React.CSSProperties, width?: string | number, height?: string | number }) => {
    const imgSrc = typeof src === 'string' ? src : undefined;

    // Helper to extract clean alt and alignment
    const processAlt = (text: string) => {
        let cleanText = text;
        let alignClass = "block mx-auto mb-6 mt-6"; // Default center

        const lowerText = text.toLowerCase();

        // Check alignment
        if (lowerText.includes("#left")) {
            alignClass = "float-left mr-6 mb-4";
            cleanText = cleanText.replace(/#left/i, "");
        } else if (lowerText.includes("#right")) {
            alignClass = "float-right ml-6 mb-4";
            cleanText = cleanText.replace(/#right/i, "");
        } else if (lowerText.includes("#center")) {
            alignClass = "block mx-auto mb-4";
            cleanText = cleanText.replace(/#center/i, "");
        }

        return {
            cleanText: cleanText.trim(),
            className: `${alignClass} rounded-lg max-w-full`
        };
    };

    const { cleanText, className } = processAlt(alt || "");

    // Check for inline styles or attributes from the editor's HTML output
    const finalStyle: React.CSSProperties = { ...style, height: 'auto' };

    // If explicit width is passed (from HTML attribute), use it
    if (width) {
        finalStyle.width = typeof width === 'number' ? `${width}px` : width;
    }
    // If standard next/image is used, it needs width/height or fill. 
    // If we have percentage width, we must use style.

    // Fallback: If no specific width is active, default to 100% to fit container, 
    // unless the user wants "natural" size which might break layout. 
    // Usually "w-full" (100%) is safe for responsive.
    if (!finalStyle.width) {
        finalStyle.width = '100%';
    }

    if (!imgSrc) return null;

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={cleanText}
            title={title}
            className={className}
            width={0}
            height={0}
            sizes="100vw"
            style={finalStyle}
        />
    );
};

export const CustomParagraphRenderer = ({ children, ...props }: { children?: React.ReactNode }) => {
    let alignmentClass = "";

    // Helper to process children and find/remove alignment tags
    const processChildren = (nodes: React.ReactNode[]): React.ReactNode[] => {
        return React.Children.map(nodes, (child) => {
            // Only check string children
            if (typeof child === 'string') {
                const match = child.match(/#(left|right|center|justify)\s*$/i);
                if (match) {
                    const alignment = match[1].toLowerCase();
                    alignmentClass = `text-${alignment}`;
                    // Remove the tag and any trailing whitespace
                    return child.replace(/#(left|right|center|justify)\s*$/i, '').replace(/\s+$/, '');
                }
            }
            return child;
        }) || [];
    };

    // We process children to extract the tag. 
    // Note: ReactMarkdown passes children as an array of mixed types.
    const cleanChildren = processChildren(React.Children.toArray(children));

    return (
        <p className={`mb-4 leading-7 ${alignmentClass}`} {...props}>
            {cleanChildren}
        </p>
    );
};
