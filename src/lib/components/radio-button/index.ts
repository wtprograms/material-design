import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { observe } from '../../common/lit/observable-directive';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';
import { mixinInternalsValue } from '../../common/mixins/mixin-internals-value';
import { property$ } from '../../common';

const base = mixinParentActivation(mixinInternalsValue(LitElement));

@customElement('md-radio-button')
export class MdRadioButtonElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, reflect: true })
  label: string | null = null;

  @property({ type: Boolean, reflect: true })
  @property$()
  checked = false;
  checked$!: Observable<boolean>;

  private readonly _icon$ = this.value$.pipe(
    map((value) => (value ? 'radio_button_checked' : 'radio_button_unchecked'))
  );

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
    return html`<div class="container">
        <md-ripple for="control" interactive></md-ripple>
        <md-focus-ring for="control" focus-visible></md-focus-ring>
        <md-icon ?filled="${this.checked}">${observe(this._icon$)}</md-icon>
      </div>
      <input
        id="control"
        type="radio"
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
    'md-radio-button': MdRadioButtonElement;
  }
}
