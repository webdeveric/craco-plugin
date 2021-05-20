import { compose } from '@webdeveric/utils';
import { log } from '@craco/craco/lib/logger';

import type {
  AnyRecord,
  ConfigFn,
  ConfigKey,
  Context,
  CracoConfig,
  CracoPlugin,
  CracoPluginHook,
  HookConfig,
  HookContext,
  RequireAtLeastOne,
} from './types';
import { debugConfig, withCoreOptions } from './util';

const prefix = (pre: string | undefined, message: string) => (pre ? `${pre}: ${message}` : message).trim();

export function createCracoPlugin<Options extends AnyRecord = AnyRecord>({
  name,
  getOptions = options => options as Options,
  craco = [],
  webpack = [],
  devServer = [],
  jest = [],
}: RequireAtLeastOne<
  {
    name?: string;
    getOptions?: <C extends Context>(options: Partial<Options>, context: C) => Options;
    craco?: ConfigFn<'cracoConfig', Options>[];
    webpack?: ConfigFn<'webpackConfig', Options>[];
    devServer?: ConfigFn<'devServerConfig', Options>[];
    jest?: ConfigFn<'jestConfig', Options>[];
  },
  'craco' | 'webpack' | 'devServer' | 'jest'
>): CracoPlugin<Options> {
  const createHook = <K extends ConfigKey>(
    configKey: K,
    functions: ConfigFn<K, Options>[],
  ): CracoPluginHook<typeof configKey, Options> => {
    if (! functions.length) {
      log(prefix(name, `createHook(${configKey}): no functions specified.`));

      return ({ [ configKey ]: config }) => config as HookConfig[typeof configKey];
    }

    return ({ [ configKey ]: config, cracoConfig, pluginOptions, context }) => {
      const options = withCoreOptions(getOptions(pluginOptions, context));

      if (! options.enabled) {
        log(prefix(name, `Configuring ${configKey} not enabled.`));

        return config as HookConfig[typeof configKey];
      }

      log(prefix(name, `env: ${context.env}`));

      const configure = compose<HookConfig[K], [typeof options, HookContext[K], CracoConfig]>(
        debugConfig(prefix(name, `before ${configKey}`)),
        ...functions,
        debugConfig(prefix(name, `after ${configKey}`)),
      );

      return configure(config as HookConfig[typeof configKey], options, context, cracoConfig);
    };
  };

  return {
    overrideCracoConfig: createHook('cracoConfig', craco),
    overrideWebpackConfig: createHook('webpackConfig', webpack),
    overrideDevServerConfig: createHook('devServerConfig', devServer),
    overrideJestConfig: createHook('jestConfig', jest),
    get [ Symbol.toStringTag ]() {
      return 'CracoPlugin';
    },
  };
}
