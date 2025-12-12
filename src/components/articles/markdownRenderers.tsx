import React from 'react';

export const CustomImageRenderer = ({ node, alt, src, title, ...props }: any) => {
    let className = "rounded-lg max-w-full";
    let cleanAlt = alt || "";

    if (cleanAlt.endsWith("#left")) {
        className += " float-left mr-6 mb-4 max-w-[50%]";
        cleanAlt = cleanAlt.replace("#left", "");
    } else if (cleanAlt.endsWith("#right")) {
        className += " float-right ml-6 mb-4 max-w-[50%]";
        cleanAlt = cleanAlt.replace("#right", "");
    } else if (cleanAlt.endsWith("#center")) {
        className += " block mx-auto mb-4";
        cleanAlt = cleanAlt.replace("#center", "");
    } else {
        className += " block mx-auto mb-6 mt-6";
    }

    return (
        <img
            {...props}
            src={src}
            alt={cleanAlt}
            title={title}
            className={className}
        />
    );
};

export const CustomParagraphRenderer = ({ children, ...props }: any) => {
    let alignmentClass = "";

    // Helper to process children and find/remove alignment tags
    const processChildren = (nodes: any[]): any[] => {
        return React.Children.map(nodes, (child, index) => {
            // Only check the last child (or string children) for the tag
            if (typeof child === 'string') {
                if (/#center/i.test(child)) {
                    alignmentClass = "text-center";
                    return child.replace(/#center\s*$/i, '').replace(/\s+$/, '');
                }
                if (/#left/i.test(child)) {
                    alignmentClass = "text-left";
                    return child.replace(/#left\s*$/i, '').replace(/\s+$/, '');
                }
                if (/#right/i.test(child)) {
                    alignmentClass = "text-right";
                    return child.replace(/#right\s*$/i, '').replace(/\s+$/, '');
                }
                if (/#justify/i.test(child)) {
                    alignmentClass = "text-justify";
                    return child.replace(/#justify\s*$/i, '').replace(/\s+$/, '');
                }
            }
            // If child is an element (like strong/em), we might want to peek inside, 
            // but usually the tag is at the very end of the paragraph string.
            // Complex case: "Text **Bold** #center" -> The last child is " #center"

            return child;
        });
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
