import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('renders the footer and social links', () => {
    render(<Footer />);
    expect(screen.getByText(/Seniru Dilmith/i)).toBeInTheDocument();
    expect(screen.getByText(/Made with/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by innovation/i)).toBeInTheDocument();
    expect(screen.getByText(/Next.js/i)).toBeInTheDocument();
    expect(screen.getByText(/Daisy UI/i)).toBeInTheDocument();
  });
}); 