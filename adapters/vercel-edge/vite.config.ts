import { vercelEdgeAdapter } from '@builder.io/qwik-city/adapters/vercel-edge/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import baseConfig from '../../vite.config';
import rollupNodePolyfills from 'rollup-plugin-polyfill-node';
import { nodePolyfills as viteNodePolyfills } from 'vite-plugin-node-polyfills'

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.vercel-edge.tsx', '@qwik-city-plan'],
        external: ['path', 'util', 'http', 'https', 'fs', 'stream'],
        plugins: [rollupNodePolyfills({
          include: ['node_modules/form-data/**/*.js'],
        })],
      },
      outDir: '.vercel/output/functions/_qwik-city.func',
    },
    ssr: {
      noExternal: true,
    },
    plugins: [vercelEdgeAdapter()],
  };
});
