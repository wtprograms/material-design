import '../badge';
import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';
import { mixinField, observe, property$, redispatchEvent } from '../../common';
import { MdPopoverElement } from '../popover';

const base = mixinField(LitElement);

@customElement('md-field')
export class MdFieldElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  @property$()
  populated = false;
  populated$!: Observable<boolean>;

  @property({ type: String, reflect: true })
  counter: string | null = null;

  @queryAssignedElements({ slot: 'leading', flatten: true })
  private _leadingElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing', flatten: true })
  private _trailingElements!: HTMLElement[];

  @query('.small-label')
  private _smallLabel!: HTMLElement;

  @query('md-popover')
  private _popover!: MdPopoverElement;
    
  get open() {
    return this._popover.open;
  }
  set open(value: boolean) {
    this._popover.open = value;
  }

  @property({ type: Boolean, reflect: true })
  @property$()
  leading = false;
  leading$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  trailing = false;

  @query('.body')
  private _body!: HTMLElement;

  private readonly _labelStart$ = combineLatest({
    label: this.label$,
    leading: this.leading$,
  }).pipe(
    map(({ label, leading: hasLeading }) => {
      if (!label) {
        return '';
      }
      let left = 16;
      if (hasLeading) {
        const leadingElements = this._leadingElements;
        const leadingElement = leadingElements![0];
        left += leadingElement.offsetWidth + 12;
      }
      return `${left}px`;
    })
  );
  private readonly _containerStart$ = combineLatest({
    label: this.label$,
    populated: this.populated$,
  }).pipe(
    map((x) => {
      if (!x.label || !x.populated || !this._smallLabel) {
        return '';
      }
      return 12 + 8 + this._smallLabel!.offsetWidth + 'px';
    })
  );

  override render() {
    const ripple =
      this.variant === 'filled'
        ? html`<md-ripple for="body" hoverable></md-ripple>`
        : nothing;
    return html`<span
        class="label"
        style="inset-inline-start: ${observe(this._labelStart$)}"
        >${this.label}</span
      >
      <span class="small-label">${this.label}</span>
      <div id="body" class="body" @click=${this.handleBodyClick}>
        ${ripple}
        <div class="container"></div>
        <div class="container-top border-before"></div>
        <div
          class="container-top border-after"
          style="margin-inline-start: ${observe(this._containerStart$)}"
        ></div>
        <slot
          name="leading"
          @slotchange=${() => (this.leading = !!this._leadingElements.length)}
        ></slot>
        <div class="content" @click=${this.handleContentClick}>
          <div class="control">
            ${this.prefixText}
            <slot></slot>
            ${this.suffixText}
          </div>
        </div>
        <slot
          name="trailing"
          @slotchange=${() => (this.trailing = !!this._trailingElements.length)}
        ></slot>
      </div>
      <div class="popover">
        <md-popover
          triggers="manual"
          offset="4"
          @open=${this.redispatchEvent}
          @close=${this.redispatchEvent}
          @opening=${this.redispatchEvent}
          @closing=${this.redispatchEvent}
        >
          <slot name="popover"></slot>
        </md-popover>
      </div>
      <div class="footer">
        <span class="supporting-text">${this.supportingText}</span>
        <span class="error-text">${this.errorText}</span>
        <span class="counter">${this.counter}</span>
      </div>`;
  }

  private redispatchEvent(event: Event) {
    redispatchEvent(this, event);
  }

  private handleContentClick() {
    this.dispatchEvent(new Event('content-click'));
  }

  private handleBodyClick() {
    this.dispatchEvent(new Event('body-click'));
  }

  openPopover() {
    this._popover.openComponent();
  }

  closePopover() {
    this._popover.closeComponent();
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.handleForChange();
  }

  private handleForChange() {
    if (this._popover.control !== this._body) {
      this._popover.attachControl(this._body);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-field': MdFieldElement;
  }
}
