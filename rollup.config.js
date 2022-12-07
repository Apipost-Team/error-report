import commonjs from 'rollup-plugin-commonjs'
import dts from "rollup-plugin-dts";
import typescript from "rollup-plugin-typescript";
export default [{
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'esm'
  },
  plugins: [commonjs(),typescript()],
}, {
  input: './src/index.ts',
  output: {
    file: './dist/index.d.js',
    format: 'esm'
  },
  plugins: [commonjs(),typescript(), dts()],
}]