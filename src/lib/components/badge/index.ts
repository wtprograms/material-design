import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { combineLatest, map, Observable } from 'rxjs';
import { attribute } from '../../common/rxjs/operators/attribute';
import { observe } from '../../common/lit/observable-directive';
import { property$ } from '../../common/lit/property$.decorator';

@customElement('md-badge')
export class MdBadgeElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean })
  @property$()
  dot = false;
  dot$!: Observable<boolean>;

  @property({ type: Number })
  @property$()
  number: number | null = null;
  number$!: Observable<number | null>;

  @property({ type: Boolean, reflect: true })
  embedded = false;

  readonly numberText$ = this.number$.pipe(
    map((number) => (number && number > 999 ? '999+' : number))
  );

  override connectedCallback(): void {
    super.connectedCallback();
    combineLatest({
      dot: this.dot$,
      number: this.number$,
    })
      .pipe(
        map(({ dot, number }) => !dot && number !== null && number < 10),
        attribute(this, 'single-digit')
      )
      .subscribe();
  }

  override render() {
    if (this.dot || !this.number) {
      return nothing;
    }
    return html`${observe(this.numberText$)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-badge': MdBadgeElement;
  }
}
