import { squelchEvent } from './squelch-event';

export function isActivationClick(event: Event) {
  if (event.currentTarget !== event.target) {
    return false;
  }
  if (event.composedPath()[0] !== event.target) {
    return false;
  }
  if ((event.target as EventTarget & { disabled: boolean }).disabled) {
    return false;
  }
  return !squelchEvent(event);
}
