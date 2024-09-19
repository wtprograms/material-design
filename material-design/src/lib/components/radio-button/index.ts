import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { combineLatest, distinct, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { attribute } from '../../common/rxjs/operators/attribute';
import { observe } from '../../common/lit/observable-directive';
import { property$ } from '../../common/lit/property$.decorator';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';

const base = mixinParentActivation(LitElement);

@customElement('md-radio-button')
export class MdRadioButtonElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  @property$()
  value = false;
  value$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, reflect: true })
  label: string | null = null;

  private readonly _icon$ = this.value$.pipe(
    map((value) => (value ? 'radio_button_checked' : 'radio_button_unchecked'))
  );

  override connectedCallback(): void {
    super.connectedCallback();
    this.value$
      .pipe(
        distinctUntilChanged(),
        attribute(this, 'checked'),
        tap(() => this.dispatchEvent(new Event('change')))
      )
      .subscribe();
  }

  override render() {
    return html`<div class="container">
        <md-ripple for="control" interactive></md-ripple>
        <md-focus-ring for="control" focus-visible></md-focus-ring>
        <md-icon ?filled="${this.value}">${observe(this._icon$)}</md-icon>
      </div>
      <input
        id="control"
        type="radio"
        ?disabled="${this.disabled}"
        ?checked="${this.value}"
        @change=${this.onChange}
      />
      <span class="label">${this.label}</span>`;
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
    'md-radio-button': MdRadioButtonElement;
  }
}
