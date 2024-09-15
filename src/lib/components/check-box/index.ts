import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  tap,
} from 'rxjs';
import { attribute } from '../../common/rxjs/operators/attribute';
import { observe } from '../../common/lit/observable-directive';
import { property$ } from '../../common/lit/property$.decorator';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';

const base = mixinParentActivation(LitElement);

@customElement('md-check-box')
export class MdCheckBoxElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  @property$()
  value = false;
  value$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  @property$()
  indeterminate = false;
  indeterminate$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String })
  label: string | null = null;

  private readonly _icon$ = combineLatest({
    value: this.value$,
    indeterminate: this.indeterminate$,
  }).pipe(
    map(({ value, indeterminate }) => {
      if (!value) {
        return 'check_box_outline_blank';
      } else if (value && !indeterminate) {
        return 'check_box';
      }
      return 'indeterminate_check_box';
    })
  );

  override connectedCallback(): void {
    super.connectedCallback();
    this.value$.pipe(attribute(this, 'checked')).subscribe();
    combineLatest([this.value$, this.indeterminate$])
      .pipe(
        distinctUntilChanged(),
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
        type="checkbox"
        ?disabled="${this.disabled}"
        ?checked="${this.value}"
        @change=${this.onChange}
        ?indeterminate=${this.indeterminate}
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
    'md-check-box': MdCheckBoxElement;
  }
}
