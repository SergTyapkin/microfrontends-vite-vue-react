import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl';
import * as path from 'path';
import federation from '@originjs/vite-plugin-federation';


export default defineConfig(({command, mode}) => ({
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),
    basicSsl(),
    federation({
      name: 'host',
      remotes: {
        reactChildApp: 'http://localhost:5001/assets/remoteEntryPoint.js',
        vueChildApp: 'http://localhost:5002/assets/remoteEntryPoint.js',
      },
      shared: ['vue', 'vue-router', 'vuex'],
    }),
  ],

  server: {
    proxy: {
      '/assets-reactChildApp': {
        target: `http://localhost:5001`,
        secure: false,
        changeOrigin: false,
        // rewrite: (path) => path.replace(/^\/assets/, '/dist/assets'),
      },
      '/assets-vueChildApp': {
        target: `http://localhost:5002`,
        secure: false,
        changeOrigin: false,
        // rewrite: (path) => path.replace(/^\/assets/, '/dist/assets'),
      },
    },
  },

  resolve: {
    alias: [
      {
        find: '~', // to use ~ as project root like: "import Some from '~/components/Some.vue'"
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@~', // to use @~ as node_modules root like: "import Some from '@~/Some'"
        replacement: path.resolve(__dirname, 'node_modules')
      }
    ]
  },

  publicDir: path.resolve(__dirname, "..", "shared-res", "shared-public"),
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: true,
    sourcemap: true,
    manifest: true,
    cssCodeSplit: false,
  },
}));
