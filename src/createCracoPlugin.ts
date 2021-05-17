import { compose, ComposeFn } from '@webdeveric/utils';
import { log } from '@craco/craco/lib/logger';

import type {
  ConfigObjects,
  Context,
  CoreOptions,
  CracoContext,
  CracoPlugin,
  CracoPluginHook,
  DevServerContext,
  JestContext,
  RequireAtLeastOne,
  WebpackContext,
} from './types';
import { debugConfig, withCoreOptions } from './util';

export function createCracoPlugin<Options extends CoreOptions = CoreOptions>({
  name = 'Plugin',
  getOptions,
  craco = [],
  webpack = [],
  devServer = [],
  jest = [],
}: RequireAtLeastOne<
  {
    name: string;
    getOptions: <O extends CoreOptions>(options: O, context: Context) => Options;
    craco?: ComposeFn<ReturnType<CracoPluginHook<'cracoConfig', Options>>, [Options, CracoContext]>[];
    webpack?: ComposeFn<ReturnType<CracoPluginHook<'webpackConfig', Options>>, [Options, WebpackContext]>[];
    devServer?: ComposeFn<ReturnType<CracoPluginHook<'devServerConfig', Options>>, [Options, DevServerContext]>[];
    jest?: ComposeFn<ReturnType<CracoPluginHook<'jestConfig', Options>>, [Options, JestContext]>[];
  },
  'craco' | 'webpack' | 'devServer' | 'jest'
>): CracoPlugin<Options> {
  const createHook = <ConfigKey extends keyof ConfigObjects, C extends Context>(
    configKey: ConfigKey,
    functions: ComposeFn<ReturnType<CracoPluginHook<typeof configKey, Options>>, [Options, C]>[],
  ): CracoPluginHook<typeof configKey, Options, C> => {
    if (! functions.length) {
      log(`${name}: createHook(${configKey}): no functions specified.`);

      return parameters => parameters[ configKey ];
    }

    return ({ pluginOptions, context, [ configKey ]: config }) => {
      const options = getOptions(withCoreOptions(pluginOptions), context);

      if (! options.enabled) {
        log(`${name}: not enabled. Not configuring ${configKey}.`);

        return config;
      }

      log(`${name} env: ${context.env}`);

      const configure = compose<ConfigObjects[ConfigKey], [Options, C]>(
        debugConfig(`Before: ${configKey}`),
        ...functions,
        debugConfig(`After: ${configKey}`),
      );

      return configure(config, options, context);
    };
  };

  return {
    overrideCracoConfig: createHook('cracoConfig', craco),
    overrideWebpackConfig: createHook('webpackConfig', webpack),
    overrideDevServerConfig: createHook('devServerConfig', devServer),
    overrideJestConfig: createHook('jestConfig', jest),
  };
}
