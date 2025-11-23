import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
// import commonjs from "@rollup/plugin-commonjs";

// const commonjsTyped = (commonjs as unknown as (options?: RollupCommonJSOptions) => Plugin);

export default defineConfig({
  plugins: [
    fresh(),
    tailwindcss(),
    // nodePolyfills()
  ],
  esbuild: {},
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      // requireReturnsDefault: true,
    },
    // rollupOptions: {
    //   plugins: [
    //     commonjs(),
    //   ],
    // },
  },
  environments: {
    client: {
      resolve: {
        // noExternal: ["@tensorflow-models/hand-pose-detection"]
      },
    },
  },
});
