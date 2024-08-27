import { html, isServer, LitElement, nothing } from 'lit';
import { property, query, queryAssignedElements } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { MdButtonElement, MdElevationElement } from '../../components';
import { redispatchEvent } from '../events/redispatch-event';
import { DURATION } from '../motion/duration';
import { EASING } from '../motion/easing';
import { mixinPopup, Popup } from './mixin-popup';

export interface Dialog extends Popup {
  returnValue: string;
  hasIcon: boolean;
  iconSlots: HTMLElement[];
  hasSupportingText: boolean;
  supportingTextSlots: HTMLElement[];
  hasActions: boolean;
  actionsSlots: HTMLElement[];
  hasBody: boolean;
  bodySlots: HTMLElement[];
  noFocusTrap: boolean;
  dialog: HTMLDialogElement;
  scrim: HTMLDivElement;
  container: HTMLDivElement;
  elevation: MdElevationElement;
  headline: HTMLDivElement;
  supportingText: HTMLDivElement;
  scroller: HTMLDivElement;
  actions: HTMLDivElement;
  renderDialog(): unknown;
  renderHeader(): unknown;
  animateScrim(): Animation | undefined;
  animateDialogElement(): Animation | undefined;
  animateContainer(): Animation | undefined;
  animateContainerBefore(): Animation | undefined;
  animateElevation(): Animation | undefined;
  animateHeadline(): Animation | undefined;
  animateSupportingText(): Animation | undefined;
  animateScroller(): Animation | undefined;
  animateActions(): Animation | undefined;
  closeComponent(returnValue?: string): Promise<void>;
}

export function mixinDialog<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Dialog> {
  const _base = mixinPopup(base);
  abstract class Mixin extends _base implements Dialog {
    @property({ attribute: false })
    returnValue = '';

    @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
    hasIcon = false;

    @queryAssignedElements({ slot: 'icon', flatten: true })
    readonly iconSlots!: HTMLElement[];

    @property({
      type: Boolean,
      reflect: true,
      attribute: 'has-supporting-text',
    })
    hasSupportingText = false;

    @property({
      type: Boolean,
      reflect: true,
      attribute: 'has-supporting-text',
    })
    hasHeadline = false;

    @queryAssignedElements({ slot: 'icon', flatten: true })
    readonly supportingTextSlots!: HTMLElement[];

    @queryAssignedElements({ slot: 'headline', flatten: true })
    readonly headlineSlots!: HTMLElement[];

    @property({ type: Boolean, reflect: true, attribute: 'has-actions' })
    hasActions = false;

    @queryAssignedElements({ slot: 'icon', flatten: true })
    readonly actionsSlots!: HTMLElement[];

    @property({ type: Boolean, reflect: true, attribute: 'has-body' })
    hasBody = false;

    @queryAssignedElements({ slot: 'body', flatten: true })
    readonly bodySlots!: HTMLElement[];

    @property({ type: Boolean, attribute: 'no-focus-trap' })
    noFocusTrap = false;

    @query('dialog')
    dialog!: HTMLDialogElement;

    @query('.scrim')
    scrim!: HTMLDivElement;

    @query('.container')
    container!: HTMLDivElement;

    @query('md-elevation')
    elevation!: MdElevationElement;

    @query('.headline')
    headline!: HTMLDivElement;

    @query('.supporting-text')
    supportingText!: HTMLDivElement;

    @query('.scroller')
    scroller!: HTMLDivElement;

    @query('.actions')
    actions!: HTMLDivElement;

    get buttons(): MdButtonElement[] {
      return this.actionsSlots.filter(
        (x) => x instanceof MdButtonElement
      ) as MdButtonElement[];
    }

    private _isConnectedPromiseResolve!: () => void;
    private _isConnectedPromise = this.getIsConnectedPromise();
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
      if (!isServer) {
        this.addEventListener('submit', this.handleSubmit);
      }
    }

    override connectedCallback() {
      super.connectedCallback();
      this._isConnectedPromiseResolve();
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      this._isConnectedPromise = this.getIsConnectedPromise();
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

    renderHeader() {
      return html`<div class="header">
        <div class="headline">
          <div class="icon">
            <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
          </div>
          <slot name="headline" @slotchange=${this.onHeadlineSlotChange}></slot>
        </div>
        <div class="supporting-text">
          <slot
            name="supporting-text"
            @slotchange=${this.onSupportingTextChange}
          ></slot>
        </div>
      </div>`;
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
              ${this.renderHeader()}
              <div class="scroller">
                <div class="content">
                  <slot name="body" @slotchange=${this.onBodyChange}></slot>
                </div>
              </div>
              <div class="actions">
                <slot
                  name="actions"
                  @slotchange=${this.onHasActionsChange}
                ></slot>
              </div>
            </div>
          </div>
        </dialog>`;
    }

    override async showComponent() {
      this.opening = true;
      this.setAttribute('open', '');
      this.dialog.showModal();
      await this.animateComponent();
      this.opening = false;
      this.dispatchEvent(new Event('opened', { bubbles: true }));
    }

    override async closeComponent(returnValue = this.returnValue) {
      this.closing = true;
      await this.animateComponent();
      this.removeAttribute('open');
      this.dialog.close(returnValue);
      this.closing = false;
      this.dispatchEvent(new Event('closed', { bubbles: true }));
    }

    override *getComponentAnimations() {
      yield this.animateScrim();
      yield this.animateDialogElement();
      yield this.animateContainer();
      yield this.animateContainerBefore();
      yield this.animateElevation();
      yield this.animateHeadline();
      yield this.animateSupportingText();
      yield this.animateScroller();
      yield this.animateActions();
    }

    animateScrim(): Animation | undefined {
      let opacity = ['0%', '32%'];
      const easing = this.opening
        ? EASING.emphasized.decelerate
        : EASING.emphasized.accelerate;
      const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
      if (this.closing) {
        opacity = opacity.reverse();
      }
      return this.scrim.animate(
        { opacity },
        { duration, easing, fill: 'forwards' }
      );
    }

    animateDialogElement(): Animation | undefined {
      return undefined;
    }
    animateContainer(): Animation | undefined {
      return undefined;
    }
    animateContainerBefore(): Animation | undefined {
      return undefined;
    }
    animateElevation(): Animation | undefined {
      return undefined;
    }
    animateHeadline(): Animation | undefined {
      return undefined;
    }
    animateSupportingText(): Animation | undefined {
      return undefined;
    }
    animateScroller(): Animation | undefined {
      return undefined;
    }
    animateActions(): Animation | undefined {
      return undefined;
    }

    private onIconSlotChange() {
      this.hasIcon = this.iconSlots.length > 0;
    }

    private onHeadlineSlotChange() {
      this.hasHeadline = this.iconSlots.length > 0;
    }

    private onSupportingTextChange() {
      this.hasSupportingText = this.supportingTextSlots.length > 0;
    }

    private onHasActionsChange() {
      this.hasActions = this.actionsSlots.length > 0;
      for (const button of this.buttons) {
        button.variant = 'text';
      }
    }

    private onBodyChange() {
      this.hasBody = this.bodySlots.length > 0;
    }

    private getIsConnectedPromise() {
      return new Promise<void>((resolve) => {
        this._isConnectedPromiseResolve = resolve;
      });
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
