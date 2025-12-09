// Lightweight regex-based markdown stripper to avoid CPU blocking
export async function stripMarkdown(markdown: string): Promise<string> {
  if (!markdown) return "";
  
  try {
    return markdown
      // Remove horizontal rules
      .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '')
      // Remove images
      .replace(/!\[(.*?)\]\(.*?\)/g, '')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove list bullets
      .replace(/^[\t ]*[-+*]\s+/gm, '')
      // Consolidate whitespace
      .replace(/\n{2,}/g, '\n')
      .trim();
  } catch (error) {
    console.error("Error stripping markdown:", error);
    return markdown;
  }
}
