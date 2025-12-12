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
        // Default: block full width or whatever
        className += " w-full mb-6 mt-6";
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
