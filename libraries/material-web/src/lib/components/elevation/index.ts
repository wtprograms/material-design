import { LitElement, PropertyValues, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';
import { mixinAttachable } from '../../common';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

const base = mixinAttachable(LitElement);

@customElement('md-elevation')
export class MdElevationElement extends base {
  static override styles = [style];

  constructor() {
    super();
    this.initialize(
      'pointercancel',
      'pointerdown',
      'pointerenter',
      'pointerleave',
      'pointerup'
    );
  }

  @property({ type: Number })
  level: ElevationLevel | undefined;

  @property({ attribute: 'dragged', type: Boolean, reflect: true })
  isDragged = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean })
  hoverable = false;

  @property({ type: Boolean, reflect: true })
  hovered = false;

  @property({ type: Boolean })
  activatable = false;

  @property({ type: Boolean, reflect: true })
  activated = false;

  override render() {
    return html`<div class="shadow"></div>`;
  }

  protected override update(changedProps: PropertyValues<MdElevationElement>) {
    if (changedProps.has('disabled') && this.disabled) {
      this.hovered = false;
      this.activated = false;
      this.isDragged = false;
    }
    if (changedProps.has('level') && this.level !== undefined) {
      this.style.setProperty(
        '--md-comp-elevation-level-default',
        this.level.toString()
      );
    }
    super.update(changedProps);
  }

  handlePointerenter(event: PointerEvent) {
    if (!this.shouldReactToEvent(event) || !this.hoverable) {
      return;
    }

    this.hovered = true;
  }

  handlePointerleave() {
    this.hovered = false;
  }

  private handlePointerup() {
    this.activated = false;
  }

  private async handlePointerdown(event: PointerEvent) {
    if (!this.shouldReactToEvent(event) || !this.activatable) {
      return;
    }

    this.activated = true;
  }

  private handlePointercancel() {
    this.activated = false;
  }

  private shouldReactToEvent(event: PointerEvent) {
    if (this.disabled || !event.isPrimary) {
      return false;
    }

    if (event.type === 'pointerenter' || event.type === 'pointerleave') {
      return !this.isTouch(event);
    }

    const isPrimaryButton = event.buttons === 1;
    return this.isTouch(event) || isPrimaryButton;
  }

  private isTouch({ pointerType }: PointerEvent) {
    return pointerType === 'touch';
  }

  override async handleControlEvent(event: Event) {
    switch (event.type) {
      case 'pointercancel':
        this.handlePointercancel();
        break;
      case 'pointerdown':
        await this.handlePointerdown(event as PointerEvent);
        break;
      case 'pointerenter':
        this.handlePointerenter(event as PointerEvent);
        break;
      case 'pointerleave':
        this.handlePointerleave();
        break;
      case 'pointerup':
        this.handlePointerup();
        break;
      default:
        break;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-elevation': MdElevationElement;
  }
}
