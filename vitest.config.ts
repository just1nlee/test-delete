import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => ({
  plugins: [
    svelte({
      preprocess: vitePreprocess()
    })
  ],

  resolve: {
    conditions: mode === 'test' ? ['browser'] : []
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    alias: {
      '$app/state': resolve('./tests/mocks/app-state.ts'),
      '$lib':        resolve('./src/lib')
    }
  }
}));
