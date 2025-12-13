import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomParagraphRenderer } from './markdownRenderers';

describe('CustomParagraphRenderer', () => {
    it('applies text-justify class when content ends with #justify', () => {
        render(<CustomParagraphRenderer>Some text #justify</CustomParagraphRenderer>);
        const paragraph = screen.getByText('Some text');
        expect(paragraph).toHaveClass('text-justify');
        expect(paragraph).toHaveTextContent('Some text');
        expect(paragraph).not.toHaveTextContent('#justify');
    });

    it('does not apply hyphens-auto class when #justify is used', () => {
        render(<CustomParagraphRenderer>Some text #justify</CustomParagraphRenderer>);
        const paragraph = screen.getByText('Some text');
        expect(paragraph).not.toHaveClass('hyphens-auto');
    });

    it('works with normal text', () => {
        render(<CustomParagraphRenderer>Normal text</CustomParagraphRenderer>);
        const paragraph = screen.getByText('Normal text');
        expect(paragraph).not.toHaveClass('text-justify');
    });
});
