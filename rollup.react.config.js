import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

const external = ['react', 'react-dom'];

const config = [
  // ES Module build
  {
    input: 'src/react/index.ts',
    output: {
      file: 'dist/react/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
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
        mangle: {
          reserved: ['AnimateOnView', 'animate'],
        },
      }),
    ],
  },
  // CommonJS build
  {
    input: 'src/react/index.ts',
    output: {
      file: 'dist/react/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
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
        mangle: {
          reserved: ['AnimateOnView', 'animate'],
        },
      }),
    ],
  },
  // Types
  {
    input: 'src/react/index.ts',
    output: {
      file: 'dist/react/index.d.ts',
      format: 'esm',
    },
    external,
    plugins: [dts()],
  },
];

export default config;
