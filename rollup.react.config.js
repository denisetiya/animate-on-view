import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

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
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
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
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
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
