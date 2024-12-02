import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { injectLocalStorage, LocalStorageOptionsWithDefaultValue } from 'ngxtension/inject-local-storage';

export function ssrInjectLocalStorage<T>(key: string, options: LocalStorageOptionsWithDefaultValue<T>): WritableSignal<T>;
export function ssrInjectLocalStorage<T>(key: string, options?: LocalStorageOptionsWithDefaultValue<T>): WritableSignal<T | undefined> {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    return signal(options?.defaultValue as T);
  }

  return injectLocalStorage(key, options);
}