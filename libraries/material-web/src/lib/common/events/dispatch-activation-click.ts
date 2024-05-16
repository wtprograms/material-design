export function dispatchActivationClick(element: HTMLElement) {
  const event = new MouseEvent('click', {bubbles: true});
  element.dispatchEvent(event);
  return event;
}