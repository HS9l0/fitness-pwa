// @ts-check
// Library build for the FitPlan design system.
//
// Emits what a consumer (and the design-sync converter) expects from a
// published package: an ESM entry with React left external, a .d.ts tree for
// the public API, and the stylesheet that carries the design tokens.
//
// React is deliberately NOT bundled here — the converter supplies its own
// copy via _vendor/, and a second inlined React breaks hooks at render time.
import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'fs';
import { execFileSync } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

mkdirSync('dist', { recursive: true });

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/index.es.js',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  minify: false,
  jsx: 'automatic',
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  logLevel: 'info',
});

// Declarations: the converter reads these to build each <Name>Props contract.
execFileSync('node', ['node_modules/typescript/bin/tsc', '--emitDeclarationOnly'], {
  stdio: 'inherit',
});

// The PWA's own stylesheet is the token layer — designs receive only the
// @import closure of the styles.css that ships in the bundle.
copyFileSync('../styles.css', 'dist/styles.css');

console.log('Build complete → dist/');
