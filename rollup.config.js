import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve' // 引用第三方包

import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import postcssPresetEnv from 'postcss-preset-env'

import devServer from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const isProd = process.env.NODE_ENV === 'production'

const plugins = [
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: 'bundled', // 代表后面很多东西使用同一个类，只创建一个类
    exclude: 'node_modules/**' // 忽略 node_modules
  }),
  postcss({
    plugins: [
      postcssPresetEnv({ browsers: ['last 2 version'] })
    ]
  })
]

if (isProd) {
  plugins.push(terser())
} else {
  plugins.push(...[
    // 开启本地服务器
    devServer({
      open: true, // 自动打开浏览器
      port: 9000,
      contentBase: '.' // 服务于哪个文件夹，一般跟 index.html 保持一致
    }),
    // 自动刷新浏览器
    livereload()
  ])
}

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'gweidUtils',
    file: 'dist/bundle.js',
    globals: {
      lodash: "_"
    }
  },
  external: ['lodash'],
  plugins: plugins
}
