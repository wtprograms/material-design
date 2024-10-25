import { isSignal, WritableSignal } from '@angular/core';

export function isWritableSignal<T>(input: unknown): input is WritableSignal<T> {
  if (!isSignal(input)) {
    return false;
  }

  return 'set' in input;
}