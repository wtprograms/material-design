export function dispatchActivationClick(element: HTMLElement, bubbles = true) {
  const event = new MouseEvent('click', {bubbles});
  element.dispatchEvent(event);
  return event;
}