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
        external: ['util'],
        plugins: [],
      },
      outDir: '.vercel/output/functions/_qwik-city.func',
    },
    ssr: {
      noExternal: true,
    },
    plugins: [vercelEdgeAdapter(), viteNodePolyfills()],
  };
});
