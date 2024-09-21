import { html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { mixinOpenClose, OpenCloseElement } from './mixin-open-close';
import { redispatchEvent } from '../events/redispatch-event';
import { DURATION } from '../motion/duration';
import { EASING } from '../motion/easing';
import { MdElevationElement } from '../../components';

export interface DialogElement extends OpenCloseElement {
  returnValue: string | null;
  dialog: HTMLDialogElement;
  noFocusTrap: boolean;
  container: HTMLElement;
  scrim: HTMLElement;
  elevation: MdElevationElement;
  animateScrim(opening: boolean): Animation | undefined;
  renderDialog(): unknown;
  renderContent(): unknown;
}

export function mixinDialog<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, DialogElement> {
  const _base = mixinOpenClose(base);
  abstract class Mixin extends _base implements DialogElement {
    @property({ type: String, attribute: 'return-value' })
    returnValue: string | null = null;

    @property({ type: Boolean, attribute: 'no-focus-trap' })
    noFocusTrap = false;

    @query('dialog')
    dialog!: HTMLDialogElement;

    @query('.scrim')
    scrim!: HTMLElement;

    @query('.container')
    container!: HTMLElement;

    @query('md-elevation')
    elevation!: MdElevationElement;

    private readonly _firstFocusTrap!: HTMLElement | null;
    private _nextClickIsFromContent = false;
    private _escapePressedWithoutCancel = false;
    private readonly _treewalker = document.createTreeWalker(
      this,
      NodeFilter.SHOW_ELEMENT
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
      this.addEventListener('submit', this.handleSubmit);
    }

    renderDialog() {
      const showFocusTrap = this.open && !this.noFocusTrap;
      const focusTrap = html`
        <div
          class="focus-trap"
          tabindex="0"
          aria-hidden="true"
          @focus=${this.handleFocusTrapFocus}
        ></div>
      `;
      return html`<div class="scrim"></div>
        <dialog
          @cancel=${this.handleCancel}
          @click=${this.handleDialogClick}
          @close=${this.handleClose}
          @keydown=${this.handleKeydown}
          .returnValue=${this.returnValue || ''}
        >
          ${showFocusTrap ? focusTrap : nothing}
          <div class="container">
            <md-elevation level="3"></md-elevation>
            <div class="container-content" @click=${this.handleContentClick}>
              ${this.renderContent()}
            </div>
          </div>
        </dialog>`;
    }

    renderContent() {
      return html`<slot></slot>`;
    }

    private handleDialogClick() {
      if (this._nextClickIsFromContent) {
        // Avoid doing a layout calculation below if we know the click came from
        // content.
        this._nextClickIsFromContent = false;
        return;
      }

      // Click originated on the backdrop. Native `<dialog>`s will not cancel,
      // but Material dialogs do.
      const preventDefault = !this.dispatchEvent(
        new Event('cancel', { cancelable: true })
      );
      if (preventDefault) {
        return;
      }

      this.closeComponent();
    }

    private handleContentClick() {
      this._nextClickIsFromContent = true;
    }

    private handleSubmit(event: SubmitEvent) {
      const form = event.target as HTMLFormElement;
      const { submitter } = event;
      if (form.method !== 'dialog' || !submitter) {
        return;
      }

      // Close reason is the submitter's value attribute, or the dialog's
      // `returnValue` if there is no attribute.
      this.closeComponent(submitter.getAttribute('value') ?? this.returnValue);
    }

    private handleCancel(event: Event) {
      this._escapePressedWithoutCancel = false;
      const preventDefault = !redispatchEvent(this, event);
      // We always prevent default on the original dialog event since we'll
      // animate closing it before it actually closes.
      event.preventDefault();
      if (preventDefault) {
        return;
      }

      this.closeComponent();
    }

    private handleClose() {
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

    animateScrim(opening: boolean): Animation | undefined {
      let opacity = ['0%', '32%'];
      const easing = opening
        ? EASING.emphasized.decelerate
        : EASING.emphasized.accelerate;
      const duration = opening ? DURATION.long[1] : DURATION.short[3];
      if (!opening) {
        opacity = opacity.reverse();
      }
      return this.scrim.animate(
        { opacity },
        { duration, easing, fill: 'forwards' }
      );
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
      this._treewalker.currentNode = this._treewalker.root;
      while (this._treewalker.nextNode()) {
        // Cast as Element since the TreeWalker filter only accepts Elements.
        const nextChild = this._treewalker.currentNode as Element;
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
  return Mixin;
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
