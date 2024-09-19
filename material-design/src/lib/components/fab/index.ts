import '../elevation';
import '../focus-ring';
import '../ripple';
import '../progress-indicator';
import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  queryAssignedNodes,
} from 'lit/decorators.js';
import { styles } from './styles';
import {
  animateElement,
  EASING,
  mixinButton,
  mixinOpenClose,
} from '../../common';
import { of, switchMap } from 'rxjs';

export type FabPalette = 'surface' | 'primary' | 'secondary' | 'tertiary';

export type FabSize = 'small' | 'medium' | 'large';

const base = mixinButton(mixinOpenClose(LitElement));

@customElement('md-fab')
export class MdFabElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  palette: FabPalette = 'primary';

  @property({ type: String, reflect: true })
  size: FabSize = 'medium';

  @property({ type: Boolean, reflect: true })
  icon = false;

  @property({ type: Boolean, reflect: true })
  lowered = false;

  @property({ type: Boolean, reflect: true })
  custom = false;

  @property({ type: Boolean, reflect: true })
  filled = false;

  @property({ type: String, reflect: true })
  label: string | null = null;

  @queryAssignedNodes({ slot: '', flatten: true })
  private _iconElements!: HTMLElement[];

  @query('.label')
  private _label!: HTMLElement;

  @query('.hidden-label')
  private _hiddenLabel!: HTMLElement;

  constructor() {
    super();
    this.openOnFirstUpdate = true;
  }

  override get openComponent$() {
    return of({}).pipe(
      switchMap(() => {
        if (!this._label) {
          return of({});
        }
        return of({}).pipe(animateElement(() => this.animateLabel(true)));
      })
    );
  }

  override get closeComponent$() {
    return of({}).pipe(animateElement(() => this.animateLabel(false)));
  }

  protected override render(): unknown {
    return html`${this.renderAttachables()}
    ${this.renderAnchorOrButton(this.renderContent())}`;
  }

  private renderContent() {
    const slot = html`<slot
      @slotchange=${() => (this.icon = !!this._iconElements.length)}
    ></slot>`;
    const leading = this.custom
      ? html`<div class="icon">${slot}</div>`
      : html`<md-icon class="icon" ?filled=${this.filled}>${slot}</md-icon>`;
    const label = this.label
      ? html`<div class="label">${this.label}</div><div class="hidden-label">${this.label}</div>`
      : nothing;
    return html`${leading} ${label}`;
  }

  private renderAttachables() {
    return html`<md-elevation
        for="control"
        interactive
        level=${this.lowered ? 1 : 3}
      ></md-elevation>
      <md-focus-ring for="control" focus-visible></md-focus-ring>
      <md-ripple for="control" interactive></md-ripple>`;
  }

  private animateLabel(opening: boolean) {
    let opacity = ['0', '1'];
    let width = [0 + '', this._hiddenLabel.offsetWidth + 'px'];
    const easing = opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    if (!opening) {
      opacity = opacity.reverse();
      width = width.reverse();
    }

    return this._label.animate(
      {
        opacity,
        width,
      },
      {
        duration: 200,
        easing,
        fill: 'forwards',
      }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-fab': MdFabElement;
  }
}
