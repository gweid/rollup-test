import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve' // 引用第三方包

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'gweidUtils',
    file: 'dist/bundle.common.js'
  },
  plugins: [
    commonjs(),
    nodeResolve()
  ]
}
