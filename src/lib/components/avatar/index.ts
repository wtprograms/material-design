import { html, LitElement } from 'lit';
import {
  customElement,
  property,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';
import { cssProperty, mixinBusyButton, observe, property$ } from '../../common';
import { map, Observable } from 'rxjs';
import { ifDefined } from 'lit/directives/if-defined.js';

export type AvatarPalette =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'plain';

const base = mixinBusyButton(mixinParentActivation(LitElement));

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

  @property({ type: String, attribute: 'full-name' })
  @property$()
  fullName: string | null = null;
  fullName$!: Observable<string | null>;

  @property({ type: Boolean, reflect: true })
  interactive = false;

  private readonly _initial$ = this.fullName$.pipe(
    map((name) => (name ? name[0].toUpperCase() : ''))
  );

  override connectedCallback(): void {
    super.connectedCallback();
    this.size$.pipe(cssProperty(this, '--md-comp-avatar-size')).subscribe();
  }

  protected override render(): unknown {
    const _html = this.interactive
      ? html`${this.renderAttachables()}
        ${this.renderAnchorOrButton(this.renderContent())}`
      : html`${this.renderContent()}`;
    return html`${_html}${this.renderProgressIndicator()}`
  }

  private renderContent() {
    return this.src
      ? html`<img src=${this.src} alt=${ifDefined(this.fullName)} />`
      : html`<span>${observe(this._initial$)}</span>`;
  }

  private renderAttachables() {
    return html` <md-focus-ring for=${this.idName} focus-visible></md-focus-ring>
      <md-ripple for=${this.idName} interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-avatar': MdAvatarElement;
  }
}
