// @ts-check
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));

mkdirSync('dist/_vendor', { recursive: true });

// Bundle the components into a self-contained IIFE with React inline.
// The @ds-bundle header is required by the design-sync format.
const header = `// @ds-bundle name="FitnessPWA" version="${pkg.version}" globalName="FitnessPWA"`;

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'iife',
  globalName: 'FitnessPWA',
  outfile: 'dist/_ds_bundle.js',
  banner: { js: header },
  minify: false,
  jsx: 'automatic',
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  logLevel: 'info',
});

// Copy styles.css as the design token layer — designs receive only its @import closure
copyFileSync('../styles.css', 'dist/styles.css');

console.log('Build complete → dist/');
