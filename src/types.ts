import type { AnyNewable, ComposeFn } from '@webdeveric/utils';
import type { Configuration as DevServerConfig } from 'webpack-dev-server';
import type { Configuration as WebpackConfig } from 'webpack';

export type { DevServerConfig, WebpackConfig };

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type ImportMap = {
  imports: Record<string, string>;
};

export type CoreOptions = {
  enabled: boolean;
  debug: boolean;
};

export interface Context {
  env: string;
  paths: string[];
}

export type CracoContext = Context;

export type WebpackContext = Context;

export interface DevServerContext extends Context {
  proxy?: string;
  allowedHosts: string;
}

export interface JestContext extends Context {
  resolve: unknown;
  rootDir: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

export type JestConfig = AnyRecord;

export type ConfigOptions<O = AnyRecord, C = Context> = O | ((options: O, context: C) => O);

export type CracoConfig = {
  reactScriptsVersion?: string;
  style?: {
    modules?: {
      localIdentName: string;
    };
    css?: {
      loaderOptions: ConfigOptions;
    };
    sass?: {
      loaderOptions: ConfigOptions;
    };
    postcss?: {
      mode?: string;
      plugins?: unknown[];
      env?: {
        autoprefixer?: AnyRecord;
        stage?: number;
        features?: AnyRecord;
      };
      loaderOptions?: ConfigOptions;
    };
  };
  eslint?: {
    enable?: boolean;
    mode?: string;
    configure?: ConfigOptions;
    pluginOptions?: ConfigOptions;
  };
  babel?: {
    presets?: [];
    plugins?: [];
    loaderOptions?: ConfigOptions;
  };
  typescript?: {
    enableTypeChecking: boolean;
  };
  webpack?: {
    alias?: AnyRecord;
    plugins?: {
      add?: AnyNewable[];
      remove?: string[];
    };
    configure?: ConfigOptions<WebpackConfig>;
  };
  jest?: {
    babel?: {
      addPresets?: boolean;
      addPlugins?: boolean;
    };
    configure?: ConfigOptions<JestConfig>;
  };
  devServer?: ConfigOptions<DevServerConfig, Context & { proxy?: string; allowedHost: string }>;
  plugins?: CracoPluginConfig[];
};

export type CracoPluginConfig<Options extends AnyRecord = AnyRecord> = {
  plugin: CracoPlugin<Options>;
  options?: Options;
};

export type ConfigKey = 'cracoConfig' | 'webpackConfig' | 'devServerConfig' | 'jestConfig';

export type HookParameters = {
  cracoConfig: {
    config: CracoConfig;
    context: CracoContext;
  };
  webpackConfig: {
    config: WebpackConfig;
    context: WebpackContext;
  };
  devServerConfig: {
    config: DevServerConfig;
    context: DevServerContext;
  };
  jestConfig: {
    config: JestConfig;
    context: JestContext;
  };
};

export type HookConfig = {
  [P in ConfigKey]: HookParameters[P]['config'];
};

export type HookContext = {
  [P in ConfigKey]: HookParameters[P]['context'];
};

export type ConfigFn<K extends ConfigKey, Options> = ComposeFn<
  HookConfig[K],
  [Options & CoreOptions, HookContext[K], CracoConfig]
>;

export type CracoPluginHookParameters<K extends ConfigKey, O extends AnyRecord> = {
  cracoConfig: CracoConfig;
  pluginOptions: Partial<O>;
  context: HookContext[K];
} & Pick<HookConfig, K>;

export type CracoPluginHook<K extends ConfigKey, O extends AnyRecord> = (
  parameters: CracoPluginHookParameters<K, O>,
) => HookConfig[K];

export type CracoPlugin<Options extends AnyRecord = AnyRecord> = {
  overrideCracoConfig?: CracoPluginHook<'cracoConfig', Options>;
  overrideWebpackConfig?: CracoPluginHook<'webpackConfig', Options>;
  overrideDevServerConfig?: CracoPluginHook<'devServerConfig', Options>;
  overrideJestConfig?: CracoPluginHook<'jestConfig', Options>;
  readonly [Symbol.toStringTag]?: string;
};
