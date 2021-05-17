# @webdeveric/craco-plugin

## Install

```shell
npm install @webdeveric/craco-plugin --save
```

## Usage

```js
const { createCracoPlugin } = require('@webdeveric/craco-plugin');

const myCracoPlugin = createCracoPlugin({
  name: 'My Plugin',
  getOptions(options, context) {
    return {
      // default option values go here
      // you can use context.env to conditionally set values based on the NODE_ENV
      ...options,
    };
  },
  // These arrays take functions that modify the provided configuration object.
  //
  craco = [
    /*
     * This config parameter is a Craco object.
     * You can directly modify the `config` or you can return a new object.
     * The return value of this function will be the `config` parameter for
     * the next function in this array. If you don't return a value, this
     * `config` object will be used for the next function's `config` parameter.
     */
    (config, pluginOptions, context) => {
      return config;
    },
  ],
  webpack = [
    (config, pluginOptions, context) => {
      // This config parameter is a webpack config object
      return config;
    },
  ],
  devServer = [
    (config, pluginOptions, context) => {
      // This config parameter is a webpack-dev-server config object
      return config;
    },
  ],
  jest = [
    (config, pluginOptions, context) => {
      // This config parameter is a Jest config object
      return config;
    },
  ],
});
```
