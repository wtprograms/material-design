export function dispatchClosePopover(element: HTMLElement, event?: Event) {
  event?.stopPropagation();
  element.dispatchEvent(new Event('closepopover', { bubbles: true }));
}
