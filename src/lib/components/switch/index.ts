import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { property$ } from '../../common/lit/property$.decorator';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';
import { mixinInternalsValue } from '../../common/mixins/mixin-internals-value';

const base = mixinParentActivation(mixinInternalsValue(LitElement));

@customElement('md-switch')
export class MdSwitchElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  @property$()
  checked = false;
  checked$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, reflect: true })
  label: string | null = null;

  @queryAssignedElements({ slot: 'unchecked-icon' })
  private _uncheckedIconElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'checked-icon' })
  private _checkedIconElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'unchecked-icon' })
  uncheckedIcon = false;

  @property({ type: Boolean, reflect: true, attribute: 'checked-icon' })
  checkedIcon = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.value$
      .pipe(distinctUntilChanged())
      .pipe(tap((x) => (this.checked = x === '')))
      .subscribe();
    this.checked$
      .pipe(distinctUntilChanged())
      .pipe(tap((x) => (this.value = x ? '' : null)))
      .subscribe();
  }

  override render() {
    return html`<div class="track">
        <div class="container">
          <md-ripple for="control" interactive></md-ripple>
          <md-focus-ring for="control" focus-visible></md-focus-ring>
          <div class="handle">
            <span class="unchecked-icon">
              <slot
                name="unchecked-icon"
                @slotchange=${() =>
                  (this.uncheckedIcon = !!this._uncheckedIconElements.length)}
              ></slot>
            </span>
            <span class="checked-icon">
              <slot
                name="checked-icon"
                @slotchange=${() =>
                  (this.checkedIcon = !!this._checkedIconElements.length)}
              ></slot>
            </span>
          </div>
        </div>
      </div>
      <input
        id="control"
        type="checkbox"
        ?disabled="${this.disabled}"
        ?checked="${this.checked}"
        @change=${this.onChange}
      />
      <span class="label">${this.label}</span>`;
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.checked === this.checked) {
      return;
    }
    this.checked = input?.checked ?? false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MdSwitchElement;
  }
}
