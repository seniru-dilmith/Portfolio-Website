import { generateSlug } from './slug';

describe('generateSlug', () => {
    it('should lowercase the text', () => {
        expect(generateSlug('Hello')).toBe('hello');
    });

    it('should replace spaces with dashes', () => {
        expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
        expect(generateSlug('Hello! @World#')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
        expect(generateSlug('Hello   World')).toBe('hello-world');
    });

    it('should handle leading/trailing spaces', () => {
        expect(generateSlug('  Hello World  ')).toBe('hello-world');
    });

    it('should handle multiple dashes', () => {
        expect(generateSlug('Hello---World')).toBe('hello-world');
    });

    it('should handle empty string', () => {
        expect(generateSlug('')).toBe('');
    });

    it('should handle numbers', () => {
        expect(generateSlug('Article 123')).toBe('article-123');
    });
});
