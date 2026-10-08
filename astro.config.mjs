import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://heraldry.jameshoward.us',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
