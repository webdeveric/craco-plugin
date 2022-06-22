import type { AnyRecord, CoreOptions } from '../types';

export const withCoreOptions = <O extends AnyRecord>(options: O): O & CoreOptions => ({
  enabled: true,
  debug: false,
  ...options,
});
