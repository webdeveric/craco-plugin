# @webdeveric/craco-plugin

## Install

```shell
npm install @webdeveric/craco-plugin --save
```

## Usage

```js
const { createCracoPlugin } = require('@webdeveric/craco-plugin');

const myCracoPlugin = createCracoPlugin({
  // Used in verbose logging.
  name: 'My Plugin',
  /**
   * Provide default values for all of your options.
   */
  getOptions(options, context) {
    return {
      // Default option values go here.
      // Tou can use `context.env` to conditionally set values based on the NODE_ENV.
      ...options,
    };
  },
  /*
   * These arrays should contain functions that modify the provided configuration object.
   * At lease one of the arrays should be provided.
   *
   * You can directly modify the `config` or you can return a new object.
   * The return value of this function will be the `config` parameter for
   * the next function in this array. If you don't return a value, this
   * `config` object will be used for the next function's `config` parameter.
   *
   * Each function can take 4 parameters
   *  - config (one of: cracoConfig, webpackConfig, devServerConfig, jestConfig)
   *  - pluginOptions
   *  - context
   *  - cracoConfig
   */
  craco = [
    (config, pluginOptions, context, cracoConfig) => config,
  ],
  webpack = [
    (webpackConfig, pluginOptions, context, cracoConfig) => webpackConfig,
  ],
  devServer = [
    (devServerConfig, pluginOptions, context, cracoConfig) => devServerConfig,
  ],
  jest = [
    (jestConfig, pluginOptions, context, cracoConfig) => jestConfig,
  ],
});
```
