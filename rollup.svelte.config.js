import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

const external = ['svelte', 'svelte/store'];

const config = [
  // ES Module build
  {
    input: 'src/svelte/index.ts',
    output: {
      file: 'dist/svelte/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins: [
      svelte({
        compilerOptions: {
          dev: false,
          css: 'external',
        },
        preprocess: sveltePreprocess({
          typescript: true,
        }),
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
        preferBuiltins: false,
        exportConditions: ['svelte'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        importHelpers: true,
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
      }),
    ],
  },
  // CommonJS build
  {
    input: 'src/svelte/index.ts',
    output: {
      file: 'dist/svelte/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    external,
    plugins: [
      svelte({
        compilerOptions: {
          dev: false,
          css: 'external',
        },
        preprocess: sveltePreprocess({
          typescript: true,
        }),
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
        preferBuiltins: false,
        exportConditions: ['svelte'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        importHelpers: true,
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
      }),
    ],
  },
  // Types
  {
    input: 'src/svelte/index.ts',
    output: {
      file: 'dist/svelte/index.d.ts',
      format: 'esm',
    },
    external,
    plugins: [
      svelte({
        compilerOptions: {
          dev: false,
          css: 'external',
        },
        preprocess: sveltePreprocess({
          typescript: true,
        }),
        emitCss: false,
      }),
      dts({
        respectExternal: true,
      }),
    ],
  },
];

export default config;