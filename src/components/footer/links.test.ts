import links from './links';

describe('footer links', () => {
  it('should export an array of social links with correct structure', () => {
    expect(Array.isArray(links)).toBe(true);
    links.forEach(link => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('iconClass');
      expect(link).toHaveProperty('label');
    });
  });
}); 