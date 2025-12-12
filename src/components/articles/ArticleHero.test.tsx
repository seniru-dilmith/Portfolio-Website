import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleHero from './ArticleHero';

describe('ArticleHero', () => {
    it('renders the hero text correctly', () => {
        render(<ArticleHero />);

        expect(screen.getByText(/Explore My/i)).toBeInTheDocument();
        expect(screen.getByText(/Thoughts/i)).toBeInTheDocument();
        expect(screen.getByText(/A collection of articles/i)).toBeInTheDocument();
    });
});
