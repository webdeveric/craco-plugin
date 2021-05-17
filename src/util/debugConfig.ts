import type { AnyRecord, CoreOptions } from '../types';

export const debugConfig =
  (message: string) =>
  <C extends AnyRecord, O extends CoreOptions>(config: C, pluginOptions: O): void => {
    if (pluginOptions.debug) {
      console.group(message);
      console.debug(config);
      console.groupEnd();
    }
  };
