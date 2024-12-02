import { ScreenSize, screenToString } from '../screen-size';
import { DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';

export function observeMedia(
  min: ScreenSize | number,
  max?: ScreenSize | number
) {
  const platformId = inject(PLATFORM_ID);
  const minPx = screenToString(min);
  const maxPx = screenToString(max);
  const query = max
    ? `(min-width: ${minPx}) and (max-width: ${maxPx})`
    : `(min-width: ${minPx})`;

  const _signal = signal(false);
  if (isPlatformServer(platformId)) {
    return _signal.asReadonly();
  }
  const mediaQuery = window.matchMedia(query);
  const listener = () => _signal.set(mediaQuery.matches);
  mediaQuery.addEventListener('change', listener);
  listener();
  const destroyRef = inject(DestroyRef);
  destroyRef.onDestroy(() =>
    mediaQuery.removeEventListener('change', listener)
  );
  return _signal.asReadonly();
}
