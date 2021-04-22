# rollup



## rollup 的定义

Rollup 是一个 JavaScript 的模块化打包工具，可以帮助我们编译小的代码到一个大的、复杂的代码中，比如一个库或者一个应用程序



## rollup 与 webpack

总的来说，rollup 的定位与 webpack 很相似：

- Rollup 也是一个模块化的打包工具，默认是针对 ES Module 进行打包的，也就是在不使用插件的情况下，Rollup 不能打包 commonjs
- webpack 通常可以通过各种 loader 处理各种各样的文件，以及处理它们的依赖关系；rollup 更多时候是专注于处理 JavaScript 代码（当然也可以处理css、font、vue等文件）
- rollup 的配置和理念相对于 webpack 来说，更加的简洁和容易理解
- 在早期 webpack 不支持 tree shaking 时，rollup 具备更强的优势
- rollup 打包出来的文件体积会比 webpack 小一些

所以，总的来说，rollup 更加适合**纯js库文件的打包**（例如 vue、react 源码）；而 webpack 更加适合项目、组件库打包（例如基于 vue 或者 react 开发的项目）



## 基本使用

### 配置文件

跟 webpack 类似，rollup 也是通过配置文件，传入需要使用的打包配置

在项目根目录下创建 rollup.config.js 文件

```
rollup-test
├── node_modules
├── src
├── └── index.js
└── rollup.config.js
```

然后 rollup.config.js 中：

```js
export default {
  
}
```

这里导出也可以使用 `module.exports = {}`，但 rollup 更多的是打包 esmodule 的，所以一般习惯使用 es 的模块化导出



配置 package.json

```js
{
    "scripts": {
        "build": "rollup -c"
     }
}
```

-c 后面可以指定配置文件，如果使用默认 rollup.config.js 则不需要写



### 出入口

#### 入口

```js
export default {
  input: './src/index.js'
}
```

跟 webpack 类似，只是名字从 webpack 的 entry 改为 input



#### 出口

看看出口的几个属性

- format：打包的模式

  - iife：打包浏览器的库，iife 其实就是自执行函数

    打包后的代码：

    ```js
    // 就是定义了一个自执行函数，在浏览器中执行
    (function (exports) {
      'use strict';
    
      const sum = (num1, num2) => {
        return num1 + num2
      };
    
      console.log(sum(1, 2));
    
      exports.sum = sum;
    
      Object.defineProperty(exports, '__esModule', { value: true });
    
      return exports;
    
    }({}));
    ```

  - es：打包使用 es 导出的库

    打包后的代码：

    ```js
    const sum = (num1, num2) => {
      return num1 + num2
    };
    
    console.log(sum(1, 2));
    
    export { sum };
    ```

  - amd：打包 amd 的库

    打包后的代码：

    ```js
    define(['exports'], function (exports) { 'use strict';
    
      const sum = (num1, num2) => {
        return num1 + num2
      };
    
      console.log(sum(1, 2));
    
      exports.sum = sum;
    
      Object.defineProperty(exports, '__esModule', { value: true });
    
    });
    ```

  - cjs：打包 CommomJS 的库

    打包后的代码：

    ```js
    'use strict';
    
    Object.defineProperty(exports, '__esModule', { value: true });
    
    const sum = (num1, num2) => {
      return num1 + num2
    };
    
    console.log(sum(1, 2));
    
    exports.sum = sum;
    ```

  - umd：打包通用库（就是上面三种都支持），需要注意的是，使用 umd 必须在出口中设置 name 属性

    打包后的代码：

    ```js
    (function (global, factory) {
      // 判断是使用哪种环境，CommonJS 还是 amd 还是 浏览器
      typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
      typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.gweidUtils = {}));
    }(this, (function (exports) { 'use strict';
    
      const sum = (num1, num2) => {
        return num1 + num2
      };
    
      console.log(sum(1, 2));
    
      exports.sum = sum;
    
      Object.defineProperty(exports, '__esModule', { value: true });
    
    })));
    ```

- name：指定的名字，到时候别的地方引用这个包可以通过这个名字（umd 格式必须要指定 name）

- file：打包后的文件名字（可以跟上路径，例如：dist/bundle.js）

rollup.config.js 配置：

```js
export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'gweidUtils', // umd 必须要有 name
    file: 'dist/bundle.js'
  }
}
```

使用 umd 打包通用的库模式固然好，但是这样子就会有兼容代码在里面，造成库过大

解决方案：分别打包支持不同环境的库

```js
export default {
  input: './src/index.js',
  output: [
    {
      format: 'iife',
      name: 'gweidUtils',
      file: 'dist/bundle.browser.js'
    },
    {
      format: 'es',
      file: 'dist/bundle.es.js'
    },
    {
      format: 'amd',
      file: 'dist/bundle.amd.js'
    },
    {
      format: 'cjs',
      file: 'dist/bundle.commom.js'
    }
  ]
}
```

就可以分别生成支持不同环境的库文件

![](/imgs/img1.png)



### 打包 CommonJS 代码

rollup 默认是针对 esmodule 打包的，也就是说，在代码中通过 commonjs 的方式写代码，虽然是不会打包失败，但是打包出来的代码浏览器并不能识别，所以会造成浏览器报错

例如：

> src/utils/common.js

```js
const msg = 'commonjs 模块化'

module.exports = {
  msg
}
```

> src/index.js

```js
const { msg } = require('./utils/common')

console.log(msg)
```

打包后的结果：

```js
(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	const { msg } = require('./utils/common');

	console.log(msg);
})));
```

可以看到，打包后依然是通过 require 引入代码，直接在浏览器中是不能识别的，所以会报错

此时，就需要用到插件去处理，rollup 官方插件库：

```
https://github.com/rollup/plugins
```

使用 `@rollup/plugin-commonjs` 处理：

安装：

```js
npm install @rollup/plugin-commonjs -D
```

使用：

```js
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'gweidUtils',
    file: 'dist/bundle.common.js'
  },
  plugins: [
    commonjs()
  ]
}
```

但是同时注意，在导入的时候改为：esmodule 方式

> src/index.js

```js
import { msg } from './utils/common'

console.log(msg)
```

如果不安装 commonjs 的时候，使用 CommonJS 导出，esModule 导入打包会报错

**基于以上问题，还是不建议在 rollup 中写 CommonJS 的代码，直接写 esModule 代码**

思考：为什么 rollup 要这样子做呢？支持  CommonJS 导出，但是必须要 esModule 导入，并且就算是 CommonJS 导出的也必须使用 esModule 导入，通过 `@rollup/plugin-commonjs` 解决

> 因为，当在 rollup 中使用到一些第三方库的时候，可能第三方库就只有 CommonJS 导出的，那么就需要支持 CommonJS 导出



### 使用第三方库

比如，需要使用 lodash：

> src/index.js

```js
import _ from 'lodash'

console.log(_.merge({name: 'hahaha'}, {age: 18}))
```

如果直接打包，会发现打包后的结果根本就没有 lodash 代码：

```js
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('lodash')) :
	typeof define === 'function' && define.amd ? define(['lodash'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global._));
}(this, (function (_) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

	console.log(___default['default'].merge({name: 'hahaha'}, {age: 18}));

})));
```

这是因为，rollup 中规定使用第三方包，也就是安装在 node_modules 下面的包，需要使用插件 `@rollup/plugin-node-resolve` 处理

安装：

```js
npm install @rollup/plugin-node-resolve -D
```

使用：lodash 也是 common 导出的，所以也需要使用插件 `@rollup/plugin-commonjs`

```js
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
```

