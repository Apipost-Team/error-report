import path from 'path';
import dts from 'rollup-plugin-dts';
import ts from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import { terser } from 'rollup-plugin-terser';
export default [
  {
    input: './src/core/index.ts',
    external: [],
    output: [
      {
        file: path.resolve(__dirname, './dist/index.js'),
        format: 'umd',
        name: 'Monitor',
        globals: {
          "mobile-detect": "MobileDetect"
        }
      },
      {
        file: path.resolve(__dirname, './dist/index.esm.js'),
        format: 'esm'
      },
      {
        file: path.resolve(__dirname, './dist/index.cjs.js'),
        format: 'cjs'
      },
    ],
    plugins: [ts(), commonjs(), resolve(), terser({
      compress: true,
    })]
  },
  {
    input: './src/core/index.ts',
    output: 
    {
      file: path.resolve(__dirname, './dist/index.d.ts'),
      format: 'es'
    },
    plugins: [
      dts(),
      commonjs(),
      resolve()
    ]
  }
];
