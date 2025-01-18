export function dispatchCloseDialog(element: HTMLElement, event?: Event) {
  event?.stopPropagation();
  element.dispatchEvent(new Event('closedialog', { bubbles: true }));
}
