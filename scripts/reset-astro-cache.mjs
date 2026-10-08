// Generated Astro content and Vite files can be stale after interrupted dev runs.
// Remove only these known cache paths, and only BEFORE launching the dev server.
import {rmSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
for (const folder of ['.astro','node_modules/.astro','node_modules/.vite']) {
  rmSync(resolve(root,folder),{recursive:true,force:true});
}
console.log('Reset Astro content/Vite caches; they regenerate automatically.');
