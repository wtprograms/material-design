/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, nothing } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property, query } from 'lit/decorators.js';
import { Dialog } from './dialog';
import { mixinOpenable } from '../openable/mixin-openable';
import { AutoResetEvent } from '../../promise/auto-reset-event';
import { redispatchEvent } from '../../events/redispatch-event';

export function mixinDialog<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Dialog> {
  const _base = mixinOpenable(base);
  abstract class DialogMixin extends _base implements Dialog {
    @property({ attribute: false })
    returnValue = '';

    @property({ type: Boolean, attribute: 'no-focus-trap' })
    noFocusTrap = false;

    @query('dialog')
    readonly dialog!: HTMLDialogElement | null;

    @query('.focus-trap')
    private readonly _firstFocusTrap!: HTMLElement | null;

    @query('.body')
    readonly body!: HTMLElement | null;
  
    @query('.scrim')
    readonly scrim!: HTMLElement | null;

    readonly isConnectedLatch = new AutoResetEvent();
    private readonly treewalker = document.createTreeWalker(
      this,
      NodeFilter.SHOW_ELEMENT
    );

    private _escapePressedWithoutCancel = false;
    private _nextClickIsFromContent = false;

    override connectedCallback() {
      super.connectedCallback();
      this.isConnectedLatch.set();
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      this.isConnectedLatch.reset();
    }

    protected override render() {
      return html`${this.renderScrim()} ${this.renderDialog()}`;
    }

    renderScrim() {
      return html`<div class="scrim"></div>`;
    }

    renderFocusTrap() {
      const showFocusTrap = this.open && !this.noFocusTrap;
      const focusTrap = html`
        <div
          class="focus-trap"
          tabindex="0"
          aria-hidden="true"
          @focus=${this.handleFocusTrapFocus}
        ></div>
      `;
      return showFocusTrap ? focusTrap : nothing;
    }

    renderElevation() {
      return html`<md-elevation level="3"></md-elevation>`;
    }

    renderContent() {
      return html``;
    }

    renderDialog() {
      return html`<dialog
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleCloseDialog}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue}
      >
        ${this.renderFocusTrap()}
        <div class="container" @click=${this.handleContentClick}>
          <div class="container-paint">${this.renderElevation()}</div>
          ${this.renderContent()}
        </div>
      </dialog>`;
    }

    override async handleShow(): Promise<boolean> {
      await this.isConnectedLatch.waitOne();
      await this.updateComplete;
  
      if (!!this.dialog?.open) {
        return false;
      }
  
      const preventOpen = !this.dispatchEvent(
        new Event('open', { cancelable: true })
      );
      if (preventOpen) {
        this.open = false;
        return false;
      }
  
      this.dialog!.style.display = 'flex';
      this.scrim!.style.display = 'flex';
      this.dialog?.showModal();
  
      if (this.body) {
        this.body.scrollTop = 0;
      }
  
      this.querySelector<HTMLElement>('[autofocus]')?.focus();
  
      await this.animateOpen();
      this.dispatchEvent(new Event('opened'));
      return true;
    }
  
    override async handleClose(...args: any[]): Promise<boolean> {
      if (!this.isConnected || !this.dialog?.open) {
        return false;
      }
      const returnValue = args[0] ?? this.returnValue;
      const previousReturnValue = this.returnValue;
      this.returnValue = returnValue;
      const preventClose = !this.dispatchEvent(
        new Event('close', { cancelable: true })
      );
      if (preventClose) {
        this.open = true;
        this.returnValue = previousReturnValue;
        return false;
      }
  
      await this.animateClose();
      this.dialog.close(returnValue);
      this.open = false;
      this.dialog.style.display = 'none';
      this.scrim!.style.display = 'none';
      this.dispatchEvent(new Event('closed'));
      return true;
    }

    private handleCloseDialog() {
      if (!this._escapePressedWithoutCancel) {
        return;
      }

      this._escapePressedWithoutCancel = false;
      this.dialog?.dispatchEvent(new Event('cancel', { cancelable: true }));
    }

    private handleKeydown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      // An escape key was pressed. If a "close" event fires next without a
      // "cancel" event first, then we know we're in the Chrome v120 bug.
      this._escapePressedWithoutCancel = true;
      // Wait a full task for the cancel/close event listeners to fire, then
      // reset the flag.
      setTimeout(() => {
        this._escapePressedWithoutCancel = false;
      });
    }

    private handleContentClick() {
      this._nextClickIsFromContent = true;
    }

    private handleCancel(event: Event) {
      if (event.target !== this.dialog) {
        return;
      }

      this._escapePressedWithoutCancel = false;
      const preventDefault = !redispatchEvent(this, event);
      event.preventDefault();
      if (preventDefault) {
        return;
      }

      this.close();
    }

    private handleDialogClick() {
      if (this._nextClickIsFromContent) {
        this._nextClickIsFromContent = false;
        return;
      }

      const preventDefault = !this.dispatchEvent(
        new Event('cancel', { cancelable: true })
      );
      if (preventDefault) {
        return;
      }

      this.close();
    }

    private handleFocusTrapFocus(event: FocusEvent) {
      const [firstFocusableChild, lastFocusableChild] =
        this.getFirstAndLastFocusableChildren();
      if (!firstFocusableChild || !lastFocusableChild) {
        // When a dialog does not have focusable children, the dialog itself
        // receives focus.
        this.dialog?.focus();
        return;
      }

      // To determine which child to focus, we need to know which focus trap
      // received focus...
      const isFirstFocusTrap = event.target === this._firstFocusTrap;
      const isLastFocusTrap = !isFirstFocusTrap;
      // ...and where the focus came from (what was previously focused).
      const focusCameFromFirstChild =
        event.relatedTarget === firstFocusableChild;
      const focusCameFromLastChild = event.relatedTarget === lastFocusableChild;
      // Although this is a focus trap, focus can come from outside the trap.
      // This can happen when elements are programmatically `focus()`'d. It also
      // happens when focus leaves and returns to the window, such as clicking on
      // the browser's URL bar and pressing Tab, or switching focus between
      // iframes.
      const focusCameFromOutsideDialog =
        !focusCameFromFirstChild && !focusCameFromLastChild;

      // Focus the dialog's first child when we reach the end of the dialog and
      // focus is moving forward. Or, when focus is moving forwards into the
      // dialog from outside of the window.
      const shouldFocusFirstChild =
        (isLastFocusTrap && focusCameFromLastChild) ||
        (isFirstFocusTrap && focusCameFromOutsideDialog);
      if (shouldFocusFirstChild) {
        firstFocusableChild.focus();
        return;
      }

      // Focus the dialog's last child when we reach the beginning of the dialog
      // and focus is moving backward. Or, when focus is moving backwards into the
      // dialog from outside of the window.
      const shouldFocusLastChild =
        (isFirstFocusTrap && focusCameFromFirstChild) ||
        (isLastFocusTrap && focusCameFromOutsideDialog);
      if (shouldFocusLastChild) {
        lastFocusableChild.focus();
        return;
      }

      // The booleans above are verbose for readability, but code executation
      // won't actually reach here.
    }

    private getFirstAndLastFocusableChildren() {
      let firstFocusableChild: HTMLElement | null = null;
      let lastFocusableChild: HTMLElement | null = null;

      // Reset the current node back to the root host element.
      this.treewalker.currentNode = this.treewalker.root;
      while (this.treewalker.nextNode()) {
        // Cast as Element since the TreeWalker filter only accepts Elements.
        const nextChild = this.treewalker.currentNode as Element;
        if (!isFocusable(nextChild)) {
          continue;
        }

        if (!firstFocusableChild) {
          firstFocusableChild = nextChild;
        }

        lastFocusableChild = nextChild;
      }

      // We set lastFocusableChild immediately after finding a
      // firstFocusableChild, which means the pair is either both null or both
      // non-null. Cast since TypeScript does not recognize this.
      return [firstFocusableChild, lastFocusableChild] as
        | [HTMLElement, HTMLElement]
        | [null, null];
    }
  }

  return DialogMixin;
}

function isFocusable(element: Element): element is HTMLElement {
  // Check if the element is a known built-in focusable element:
  // - <a> and <area> with `href` attributes.
  // - Form controls that are not disabled.
  // - `contenteditable` elements.
  // - Anything with a non-negative `tabindex`.
  const knownFocusableElements =
    ':is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])';
  const notDisabled = ':not(:disabled,[disabled])';
  const notNegativeTabIndex = ':not([tabindex^="-"])';
  if (
    element.matches(knownFocusableElements + notDisabled + notNegativeTabIndex)
  ) {
    return true;
  }

  const isCustomElement = element.localName.includes('-');
  if (!isCustomElement) {
    return false;
  }

  // If a custom element does not have a tabindex, it may still be focusable
  // if it delegates focus with a shadow root. We also need to check again if
  // the custom element is a disabled form control.
  if (!element.matches(notDisabled)) {
    return false;
  }

  return element.shadowRoot?.delegatesFocus ?? false;
}
