import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleForm from '@/components/articles/ArticleForm';
import '@testing-library/jest-dom';

// --- Mocks ---

// Mock framer-motion to simplify testing. This part is correct.
jest.mock('framer-motion', () => ({
    motion: {
        form: ({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
            <form {...props}>{children}</form>
        ),
    },
}));

// THIS IS THE KEY FIX: Mock next/dynamic directly.
// This tells Jest to replace any dynamically imported component with our mock.
jest.mock('next/dynamic', () => () => {
    const EditorMock = React.forwardRef<HTMLTextAreaElement, { markdown: string; onChange: (value: string) => void }>(
        ({ markdown, onChange }, ref) => (
            <textarea
                aria-label="Article Content" // Add a unique accessible name
                value={markdown}
                onChange={(e) => onChange(e.target.value)}
                ref={ref}
            />
        )
    );
    EditorMock.displayName = 'DynamicEditorMock';
    return EditorMock;
});


describe('ArticleForm', () => {
    const defaultProps = {
        formState: { title: '', content: '', tags: [] as string[], author: '', createdAt: '' },
        setFormState: jest.fn(),
        onSubmit: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all form fields', () => {
        render(<ArticleForm {...defaultProps} />);

        expect(screen.getByPlaceholderText('Enter article title...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('react, nextjs, design (comma separated)')).toBeInTheDocument();
        // Our mock is now guaranteed to be on the screen
        expect(screen.getByRole('textbox', { name: 'Article Content' })).toBeInTheDocument();
    });

    it('displays current form state values', () => {
        const formState = {
            title: 'Test Title',
            content: 'Test Content',
            tags: ['React', 'Testing'],
            author: 'Test Author',
            createdAt: '2023-01-01',
        };

        render(<ArticleForm {...defaultProps} formState={formState} />);

        expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
        expect(screen.getByDisplayValue('React, Testing')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Article Content' })).toHaveValue('Test Content');
    });

    it('calls setFormState when title input changes', async () => {
        const user = userEvent.setup();
        render(<ArticleForm {...defaultProps} />);

        const titleInput = screen.getByPlaceholderText('Enter article title...');
        await user.type(titleInput, 'New Title');

        expect(defaultProps.setFormState).toHaveBeenCalled();
    });

    it('calls setFormState when content editor changes', async () => {
        const user = userEvent.setup();
        render(<ArticleForm {...defaultProps} />);

        const contentEditor = screen.getByRole('textbox', { name: 'Article Content' });
        await user.type(contentEditor, 'New Content');

        expect(defaultProps.setFormState).toHaveBeenCalled();
    });

    it('calls setFormState when tags input changes', async () => {
        const user = userEvent.setup();
        render(<ArticleForm {...defaultProps} />);

        const tagsInput = screen.getByPlaceholderText('react, nextjs, design (comma separated)');
        await user.type(tagsInput, 'React, Testing');

        expect(defaultProps.setFormState).toHaveBeenCalled();
    });

    it('calls onSubmit when form is submitted', () => {
        const { container } = render(<ArticleForm {...defaultProps} />);
        const form = container.querySelector('form')!;
        fireEvent.submit(form);
        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('prevents default form submission', () => {
        const { container } = render(<ArticleForm {...defaultProps} />);
        const form = container.querySelector('form')!;
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        fireEvent(form, submitEvent);
        expect(submitEvent.defaultPrevented).toBe(true);
    });

    it('has required attribute on title field', () => {
        render(<ArticleForm {...defaultProps} />);
        const titleInput = screen.getByPlaceholderText('Enter article title...');
        expect(titleInput).toBeRequired();
    });

    it('shows "Save to enable image uploads" when no articleId provided', () => {
        render(<ArticleForm {...defaultProps} />);
        expect(screen.getByText(/Save to enable image uploads/i)).toBeInTheDocument();
    });

    it('shows "Drag & Drop images supported" when articleId is provided', () => {
        render(<ArticleForm {...defaultProps} articleId="123" />);
        expect(screen.getByText(/Drag & Drop images supported/i)).toBeInTheDocument();
    });
});
