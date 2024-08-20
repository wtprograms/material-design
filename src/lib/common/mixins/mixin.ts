/* eslint-disable @typescript-eslint/no-explicit-any */

export type MixinBase<ExpectedBase = object> = abstract new (
  ...args: any[]
) => ExpectedBase;

export type MixinReturn<MixinBase, MixinClass = object> = (abstract new (
  ...args: any[]
) => MixinClass) &
  MixinBase;
