export function dispatchClosePopover(element: HTMLElement) {
  element.dispatchEvent(
    new Event('popover-close', { bubbles: true })
  );
}