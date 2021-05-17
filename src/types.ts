import type { Plugin, Configuration as WebpackConfig } from 'webpack';
import type { Configuration as DevServerConfig } from 'webpack-dev-server';

export type { DevServerConfig, WebpackConfig };

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type WebpackPlugin = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any;
} & Plugin;

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
      add?: WebpackPlugin[];
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
  // TODO fix the type for `plugins`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: any[];
};

// export type CracoPluginConfig<Options extends AnyRecord = AnyRecord> = {
//   plugin: CracoPlugin<Options>;
//   options?: Options;
// };

export type ConfigObjects = {
  cracoConfig: CracoConfig;
  webpackConfig: WebpackConfig;
  devServerConfig: DevServerConfig;
  jestConfig: JestConfig;
};

export type CracoPluginHookParameters<K extends keyof ConfigObjects, O extends AnyRecord, C extends Context = Context> =
  {
    cracoConfig: CracoConfig;
    pluginOptions: Partial<O>;
    context: C;
  } & Pick<ConfigObjects, K>;

export type CracoPluginHook<K extends keyof ConfigObjects, O extends AnyRecord, C extends Context = Context> = (
  parameters: CracoPluginHookParameters<K, O & CoreOptions, C>,
) => ConfigObjects[K];

export type CracoPlugin<Options extends AnyRecord = AnyRecord> = {
  overrideCracoConfig?: CracoPluginHook<'cracoConfig', Options, CracoContext>;
  overrideWebpackConfig?: CracoPluginHook<'webpackConfig', Options, WebpackContext>;
  overrideDevServerConfig?: CracoPluginHook<'devServerConfig', Options, DevServerContext>;
  overrideJestConfig?: CracoPluginHook<'jestConfig', Options, JestContext>;
};
