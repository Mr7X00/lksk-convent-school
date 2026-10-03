import fs from 'fs';
import { resolve, relative, extname } from 'path';
import { defineConfig } from 'vite';

function findHtmlInputs(dir, baseDir = dir, inputs = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlInputs(fullPath, baseDir, inputs);
    } else if (entry.isFile() && extname(entry.name) === '.html') {
      const rel = relative(baseDir, fullPath).replace(/\\/g, '/');
      const key = rel === 'index.html' ? 'main' : rel.replace(/\.html$/, '').replace(/\/index$/, '').replace(/[\/-]/g, '_');
      inputs[key] = fullPath;
    }
  }
  return inputs;
}

export default defineConfig({
  server: {
    host: true,
    allowedHosts: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: findHtmlInputs(__dirname),
    },
  },
});
