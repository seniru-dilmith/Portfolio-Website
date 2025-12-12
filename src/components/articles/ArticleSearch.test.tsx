import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleSearch from './ArticleSearch';

describe('ArticleSearch', () => {
    it('renders the search input', () => {
        const setSearchQuery = jest.fn();
        render(<ArticleSearch searchQuery="" setSearchQuery={setSearchQuery} />);

        const input = screen.getByPlaceholderText(/Search articles.../i);
        expect(input).toBeInTheDocument();
    });

    it('calls setSearchQuery when input changes', () => {
        const setSearchQuery = jest.fn();
        render(<ArticleSearch searchQuery="" setSearchQuery={setSearchQuery} />);

        const input = screen.getByPlaceholderText(/Search articles.../i);
        fireEvent.change(input, { target: { value: 'React' } });

        expect(setSearchQuery).toHaveBeenCalledWith('React');
    });

    it('displays the current search query', () => {
        const setSearchQuery = jest.fn();
        render(<ArticleSearch searchQuery="Next.js" setSearchQuery={setSearchQuery} />);

        const input = screen.getByDisplayValue('Next.js');
        expect(input).toBeInTheDocument();
    });
});
