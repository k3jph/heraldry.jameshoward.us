import { defineConfig } from 'astro/config';
import scrollableTables from './scripts/scrollable-tables.mjs';

export default defineConfig({
  site: 'https://heraldryproject.org',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: { rehypePlugins: [scrollableTables] },
});
