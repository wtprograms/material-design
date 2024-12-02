import { signal, WritableSignal } from '@angular/core';

export type OptionsSignal<T> = WritableSignal<T> & { values: T[] };

export function options<T>(...values: T[]): OptionsSignal<T> {
  const _signal = signal(values[0]) as OptionsSignal<T>;
  _signal.values = values;
  return _signal;
}