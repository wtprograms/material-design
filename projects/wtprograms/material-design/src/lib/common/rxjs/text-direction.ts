import { DOCUMENT, isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID, Signal, signal } from '@angular/core';

export type Direction = 'ltr' | 'rtl';

export function textDirection(): Signal<Direction> {
  const document = inject(DOCUMENT);
  const platformId = inject(PLATFORM_ID);
  const dirSignal = signal<Direction>(document.dir ? document.dir as Direction : 'ltr');
  if (isPlatformServer(platformId)) {
    return dirSignal;
  }

  const observer = new MutationObserver(() => {
    dirSignal.set(document.dir ? document.dir as Direction : 'ltr');
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
  return dirSignal;
}