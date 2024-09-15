import '../elevation';
import '../focus-ring';
import '../ripple';
import '../progress-indicator';
import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';
import { attribute, cssProperty, mixinButton, observe, property$ } from '../../common';
import { map, Observable } from 'rxjs';
import { ifDefined } from 'lit/directives/if-defined.js';

export type AvatarPalette =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'plain';

const base = mixinButton(mixinParentActivation(LitElement));

@customElement('md-avatar')
export class MdAvatarElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  palette: AvatarPalette = 'primary';

  @property({ type: Number })
  @property$()
  size: number | null = null;
  size$!: Observable<number | null>;

  @property({ type: String })
  src: string | null = null;

  @property({ type: String })
  @property$()
  name: string | null = null;
  name$!: Observable<string | null>;

  @property({ type: Boolean, reflect: true })
  interactive = false;

  private readonly _initial$ = this.name$.pipe(
    map((name) => (name ? name[0].toUpperCase() : ''))
  );

  override connectedCallback(): void {
    super.connectedCallback();
    this.size$.pipe(cssProperty(this, '--md-comp-avatar-size')).subscribe();
  }

  protected override render(): unknown {
    return this.interactive
      ? html`${this.renderAttachables()}
        ${this.renderAnchorOrButton(this.renderContent())}`
      : html`${this.renderContent()}`;
  }

  private renderContent() {
    return this.src
      ? html`<img src=${this.src} alt=${ifDefined(this.name)} />`
      : html`${observe(this._initial$)}`;
  }

  private renderAttachables() {
    return html` <md-focus-ring for="control" focus-visible></md-focus-ring>
      <md-ripple for="control" interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-avatar': MdAvatarElement;
  }
}
