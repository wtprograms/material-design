import { ScreenSize, screenToString } from '../screen-size';
import { observeMedia$ } from './observe-media';

export function observeScreenSize$(
  platformId: Object,
  min: ScreenSize | number,
  max?: ScreenSize | number
) {
  const minPx = screenToString(min);
  const maxPx = screenToString(max);
  const query = max
    ? `(min-width: ${minPx}) and (max-width: ${maxPx})`
    : `(min-width: ${minPx})`;
  return observeMedia$(platformId, query);
}
