/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import style from './index.scss';
import {
  AutoResetEvent,
  EASING,
  mixinOpenable,
  redispatchEvent,
  sleep,
} from '../../common';
import { SheetLayout } from './sheet-layout';

const base = mixinOpenable(LitElement);

@customElement('md-sheet')
export class MdSheetElement extends base {
  static override styles = [style];

  @property({ attribute: false })
  returnValue = '';

  @property({ type: Boolean, attribute: 'no-focus-trap' })
  noFocusTrap = false;

  @property({ type: String, reflect: true })
  layout: SheetLayout = 'start';

  private isConnectedLatch = new AutoResetEvent();
  private readonly treewalker = document.createTreeWalker(
    this,
    NodeFilter.SHOW_ELEMENT
  );

  @query('dialog')
  private readonly _dialog!: HTMLDialogElement | null;

  @query('.body')
  private readonly _body!: HTMLDivElement | null;

  @query('.header')
  private readonly _header!: HTMLDialogElement | null;

  @query('.supporting-text')
  private readonly _supportingText!: HTMLDivElement | null;

  @query('.action')
  private readonly _action!: HTMLDivElement | null;

  @query('.container')
  private readonly _container!: HTMLDivElement | null;

  @query('.container-paint')
  private readonly _containerPaint!: HTMLDivElement | null;

  @query('.scrim')
  private readonly _scrim!: HTMLDivElement | null;

  @query('.focus-trap')
  private readonly _firstFocusTrap!: HTMLElement | null;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly _iconElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'headline', flatten: true })
  private readonly _headlineElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'supporting-text', flatten: true })
  private readonly _supportingTextElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'body', flatten: true })
  private readonly _bodyElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-headline' })
  hasHeadline = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-supporting-text' })
  hasSupportingText = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-body' })
  hasBody = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-action' })
  hasAction = false;

  private _escapePressedWithoutCancel = false;
  private _nextClickIsFromContent = false;

  protected override render() {
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
        @close=${this.handleCloseDialog}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue}
      >
        ${showFocusTrap ? focusTrap : nothing}
        <div class="container" @click=${this.handleContentClick}>
          <div class="handle handle-top"></div>
          <div class="container-paint">
            <md-elevation level="3"></md-elevation>
          </div>
          <div class="header" ?hidden=${!this.hasIcon && !this.hasHeadline}>
            <span class="headline" ?hidden=${!this.hasHeadline}
              ><slot name="headline" @slotchange=${this.onSlotChange}></slot
            ></span>
            <div class="supporting-text" ?hidden=${!this.hasSupportingText}>
              <slot
                name="supporting-text"
                @slotchange=${this.onSlotChange}
              ></slot>
            </div>
          </div>
          <div class="body">
            <slot></slot>
          </div>
          <div class="action" ?hidden=${!this.hasAction}>
            <slot name="action" @slotchange=${this.onSlotChange}></slot>
          </div>
          <div class="handle handle-bottom"></div>
        </div>
      </dialog>`;
  }

  private onSlotChange() {
    this.hasIcon = this._iconElements.length > 0;
    this.hasHeadline = this._headlineElements.length > 0;
    this.hasSupportingText = this._supportingTextElements.length > 0;
    this.hasAction = this._actionElements.length > 0;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.isConnectedLatch.set();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.isConnectedLatch.reset();
  }

  override async handleShow(...args: any[]): Promise<boolean> {
    await this.isConnectedLatch.waitOne();
    await this.updateComplete;

    if (!!this._dialog?.open) {
      return false;
    }

    const preventOpen = !this.dispatchEvent(
      new Event('open', { cancelable: true })
    );
    if (preventOpen) {
      this.open = false;
      return false;
    }

    this._dialog!.style.display = 'flex';
    this._scrim!.style.display = 'flex';
    this._dialog?.showModal();

    if (this._body) {
      this._body.scrollTop = 0;
    }

    this.querySelector<HTMLElement>('[autofocus]')?.focus();

    await this.animateOpen();
    this.dispatchEvent(new Event('opened'));
    return true;
  }

  override async handleClose(...args: any[]): Promise<boolean> {
    if (!this.isConnected || !this._dialog?.open) {
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
    this._dialog.close(returnValue);
    this.open = false;
    this._dialog.style.display = 'none';
    this._scrim!.style.display = 'none';
    this.dispatchEvent(new Event('closed'));
    return true;
  }

  override async animateOpen(): Promise<void> {
    this.cancelAnimations();
    this.animateDialog(true);
    this.animateScrim(true);
    this.animateBody(true);
    await this.animationsPromise();
  }

  override async animateClose(): Promise<void> {
    this.cancelAnimations();
    this.animateDialog(false);
    this.animateScrim(false);
    this.animateBody(false);
    await this.animationsPromise();
  }

  private async animateDialog(open: boolean) {
    const opacity = open ? [0, 1] : [1, 0];
    const easing = open
      ? EASING.emphasized.decelerate
      : EASING.standard.accelerate;

    const translates = {
      top: ['translateY(-100%)', 'translateY(0)'],
      end: ['translateX(100%)', 'translateY(0)'],
      bottom: ['translateY(100%)', 'translateY(0)'],
      start: ['translateX(-100%)', 'translateX(0)'],
    };

    let transform = translates[this.layout];
    if (!open) {
      transform = transform.reverse();
    }

    this.animations.push(
      this._dialog!.animate(
        {
          opacity,
          transform,
        },
        {
          duration: 300,
          easing,
          fill: 'forwards',
        }
      )
    );
  }

  private async animateBody(open: boolean) {
    const opacity = open ? [0, 1] : [1, 0];
    const easing = open
      ? EASING.emphasized.decelerate
      : EASING.standard.accelerate;

    const translates = {
      top: ['translateY(-48px)', 'translateY(0)'],
      end: ['translateX(48px)', 'translateY(0)'],
      bottom: ['translateY(48px)', 'translateY(0)'],
      start: ['translateX(-48px)', 'translateX(0)'],
    };

    let transform = translates[this.layout];
    if (!open) {
      transform = transform.reverse();
    }

    this.animations.push(
      this._body!.animate(
        {
          opacity,
          transform,
        },
        {
          duration: 300,
          easing,
          fill: 'forwards',
        }
      )
    );
  }

  private async animateScrim(open: boolean) {
    const opacity = open ? [0, 0.32] : [0.32, 0];
    const easing = open
      ? EASING.emphasized.decelerate
      : EASING.standard.accelerate;
    const duration = open ? 300 : 150;
    this.animations.push(
      this._scrim!.animate(
        {
          opacity,
        },
        {
          duration,
          easing,
          fill: 'forwards',
        }
      )
    );
  }

  private handleCloseDialog() {
    if (!this._escapePressedWithoutCancel) {
      return;
    }

    this._escapePressedWithoutCancel = false;
    this._dialog?.dispatchEvent(new Event('cancel', { cancelable: true }));
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
    if (event.target !== this._dialog) {
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
      this._dialog?.focus();
      return;
    }

    // To determine which child to focus, we need to know which focus trap
    // received focus...
    const isFirstFocusTrap = event.target === this._firstFocusTrap;
    const isLastFocusTrap = !isFirstFocusTrap;
    // ...and where the focus came from (what was previously focused).
    const focusCameFromFirstChild = event.relatedTarget === firstFocusableChild;
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

declare global {
  interface HTMLElementTagNameMap {
    'md-sheet': MdSheetElement;
  }
}
