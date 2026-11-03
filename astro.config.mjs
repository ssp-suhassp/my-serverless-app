import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const siteUrl = process.env.SITE_URL || 'http://localhost:4321';
let basePath = process.env.BASE_PATH || '/';

// Normalize Windows MSYS Git bash path conversion if environment variable was translated
if (/^[A-Za-z]:[/\\]/.test(basePath)) {
  const match = basePath.match(/[/\\]Git([/\\][^/\\]+.*)$/i);
  if (match) {
    basePath = match[1].replace(/\\/g, '/');
  }
}

if (!basePath.startsWith('/')) {
  basePath = `/${basePath}`;
}

export default defineConfig({
  site: siteUrl,
  base: basePath,
  output: 'static',
  integrations: [tailwind()],
});
