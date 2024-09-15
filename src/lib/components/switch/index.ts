import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { attribute } from '../../common/rxjs/operators/attribute';
import { observe } from '../../common/lit/observable-directive';
import { property$ } from '../../common/lit/property$.decorator';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';

const base = mixinParentActivation(LitElement);

@customElement('md-switch')
export class MdSwitchElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  @property$()
  value = false;
  value$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String })
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
      .pipe(
        attribute(this, 'checked'),
        tap(() => this.dispatchEvent(new Event('change')))
      )
      .subscribe();  }

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
        ?checked="${this.value}"
        @change=${this.onChange}
      />
      ${this.label}`;
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.checked === this.value) {
      return;
    }
    this.value = input?.checked ?? false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MdSwitchElement;
  }
}
