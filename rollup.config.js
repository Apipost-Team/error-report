import commonjs from 'rollup-plugin-commonjs'
import dts from "rollup-plugin-dts";

export default [{
  input:'./src/mock.js',
  output: {
    name: 'ApipostMock',
    file: './dist/index.js',
    format: 'umd'
  },
  plugins: [commonjs()],
}]