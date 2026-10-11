// Estimate prose reading time, excluding frontmatter, footnote definitions,
// HTML markup, and link destinations. Exercise/research time is additional.
export function chapterWordCount(body = '') {
  const prose = body
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, '')
    .replace(/^\[\^[^\]]+\]:.*(?:\r?\n[ \t]+.*)*/gm, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[\^[^\]]+\]/g, '');
  return (prose.match(/[\p{L}\p{N}]+(?:['’–-][\p{L}\p{N}]+)*/gu) || []).length;
}

export function chapterReadMinutes(body) {
  return Math.max(1, Math.ceil(chapterWordCount(body) / 220));
}
