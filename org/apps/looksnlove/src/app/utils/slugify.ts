export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')     // Remove special chars
    .replace(/\-\-+/g, '-')       // Remove duplicate hyphens
    .replace(/^-+|-+$/g, '');     // Trim leading/trailing hyphens
}
