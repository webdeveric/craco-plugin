import type { Plugin, Configuration as WebpackConfig } from 'webpack';
import type { Configuration as DevServerConfig } from 'webpack-dev-server';

export type { DevServerConfig, WebpackConfig };

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

export type Context = {
  env: string;
  paths: string[];
};

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

export type CracoPluginHookParameters<ConfigKey extends keyof ConfigObjects, Options extends AnyRecord> = {
  cracoConfig: CracoConfig;
  pluginOptions: Partial<Options>;
  context: Context; // , { proxy?: string; allowedHosts: string } // , { resolve: unknown; rootDir: string }
} & Pick<ConfigObjects, ConfigKey>;

export type CracoPluginHook<ConfigKey extends keyof ConfigObjects, Options extends AnyRecord> = (
  parameters: CracoPluginHookParameters<ConfigKey, Options & CoreOptions>,
) => ConfigObjects[ConfigKey];

export type CracoPlugin<Options extends AnyRecord = AnyRecord> = {
  overrideCracoConfig?: CracoPluginHook<'cracoConfig', Options>;
  overrideWebpackConfig?: CracoPluginHook<'webpackConfig', Options>;
  overrideDevServerConfig?: CracoPluginHook<'devServerConfig', Options>;
  overrideJestConfig?: CracoPluginHook<'jestConfig', Options>;
};
