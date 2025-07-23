import { render } from '@testing-library/react';
import SmallLoadingSpinner from './SmallLoadingSpinner';
import '@testing-library/jest-dom';

describe('SmallLoadingSpinner', () => {
  it('renders an SVG spinner', () => {
    const { container } = render(<SmallLoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
}); 