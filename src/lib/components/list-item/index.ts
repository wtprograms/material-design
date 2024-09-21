import '../icon';
import '../focus-ring';
import '../ripple';
import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { dispatchActivationClick, mixinButton, property$ } from '../../common';
import { combineLatest, Observable, tap } from 'rxjs';
import { mixinSelected } from '../../common/mixins/mixin-selected';

const base = mixinButton(mixinSelected(LitElement));

@customElement('md-list-item')
export class MdListItemElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  split = false;

  @queryAssignedElements({ slot: 'supporting-text' })
  private _supportingTextElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'supporting-text' })
  supportingText = false;

  @queryAssignedElements({ slot: 'leading' })
  private _leadingElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  @property$()
  leading = false;
  leading$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  large = false;

  @property({ type: Boolean, reflect: true })
  top = false;

  @queryAssignedElements({ slot: 'trailing' })
  private _trailingElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  @property$()
  trailing = false;
  trailing$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true, attribute: 'non-interactive' })
  nonInteractive = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.handleActivationClick.bind(this));
    combineLatest({
      disabled: this.disabled$,
      leading: this.leading$,
      trailing: this.trailing$,
    })
      .pipe(
        tap((x) => {
          const elements = [
            ...this._leadingElements,
            ...this._trailingElements,
          ];
          for (const element of elements) {
            if (this.isDisabledComponent(element)) {
              element.disabled = x.disabled;
            }
          }
        })
      )
      .subscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isDisabledComponent(control: any): control is { disabled: boolean } {
    return 'disabled' in control;
  }

  protected override render(): unknown {
    const trailing = html`<slot
      name="trailing"
      @slotchange=${() => (this.trailing = !!this._trailingElements.length)}
    ></slot>`;
    const innerTrailing = this.split ? nothing : trailing;
    const outerTrailing = this.split
      ? html`<div class="split">
          <md-divider vertical variant></md-divider>
          ${trailing}
        </div>`
      : nothing;
    const control = this.nonInteractive
      ? html`<div class="body">
            <slot
              name="leading"
              @slotchange=${() =>
                (this.leading = !!this._leadingElements.length)}
            ></slot>
            ${this.renderContent()} ${innerTrailing}
          </div>
          ${outerTrailing}`
      : html`<div class="body">
            ${this.renderAttachables()}
            <slot
              name="leading"
              @slotchange=${() =>
                (this.leading = !!this._leadingElements.length)}
            ></slot>
            ${this.renderAnchorOrButton(this.renderContent())} ${innerTrailing}
          </div>
          ${outerTrailing}`;
    return control;
  }

  private renderContent() {
    return html`<div class="content">
      <div class="headline">
        <slot></slot>
      </div>
      <div class="supporting-text">
        <slot
          name="supporting-text"
          @slotchange=${() =>
            (this.supportingText = !!this._supportingTextElements.length)}
        ></slot>
      </div>
    </div>`;
  }

  private renderAttachables() {
    return html` <md-focus-ring for=${this.idName} focus-visible></md-focus-ring>
      <md-ripple for=${this.idName} interactive></md-ripple>`;
  }

  private handleActivationClick() {
    if (this.nonInteractive || this.split) {
      return;
    }
    for (const element of this._trailingElements) {
      dispatchActivationClick(element, false);
    }
    this.dispatchEvent(new Event('close-popover', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item': MdListItemElement;
  }
}
