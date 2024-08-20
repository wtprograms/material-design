import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { html, LitElement, PropertyValues } from 'lit';
import {
  mixinActivatable,
  mixinAttachable,
  mixinDisabled,
  mixinHoverable,
} from '../../common';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

const base = mixinDisabled(
  mixinHoverable(mixinActivatable(mixinAttachable(LitElement)))
);

@customElement('md-elevation')
export class MdElevationElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'is-hovering' })
  isHovering = false;

  @property({ type: Boolean, reflect: true, attribute: 'is-activated' })
  isActivated = false;

  @property({ type: Boolean, reflect: true, attribute: 'is-dragging' })
  isDragging = false;

  @property({ type: Number })
  level: ElevationLevel | null = null;

  constructor() {
    super();
    this.initialize(
      'pointerdown',
      'pointerup',
      'pointerenter',
      'pointerleave',
      'pointercancel'
    );
 }

  protected override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('disabled') && this.disabled) {
      this.isHovering = false;
      this.isActivated = false;
    }
    if (changedProperties.has('level')) {
      if (this.level !== null) {
        this.style.setProperty('--md-comp-elevation-level', this.level + '');
      } else {
        this.style.removeProperty('--md-comp-elevation-level');
      }
    }
    super.updated(changedProperties);
  }

  protected override render(): unknown {
    return html`<div class="shadow"></div>`;
  }

  override async handleControlEvent(event: Event): Promise<void> {
    if (this.disabled) {
      return;
    }

    if ((this.hoverable || this.activatable) && event.type === 'pointerenter') {
      this.isHovering = true;
    }
    if (event.type === 'pointerleave') {
      this.isHovering = false;
    }

    if (this.activatable && event.type === 'pointerdown') {
      this.isActivated = true;
    }
    if (event.type === 'pointerup') {
      this.isActivated = false;
    }

    if (event.type === 'pointercancel') {
      this.isHovering = false;
      this.isActivated = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-elevation': MdElevationElement;
  }
}
