/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import style from './index.scss';
import { EASING, mixinOpenable } from '../../common';

const base = mixinOpenable(LitElement);

@customElement('md-snackbar')
export class MdSnackbarElement extends base {
  static override styles = [style];

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-action' })
  hasAction = false;

  @property({ type: Number })
  timeout = 7500;

  private _timeoutHandle: any;

  constructor() {
    super();
    this.addEventListener('opened', this.handleOpened.bind(this));
    this.addEventListener('closed', this.handleClosed.bind(this));
  }

  private handleOpened() {
    this._timeoutHandle = setTimeout(() => {
      if (this.open) {
        this.open = false;
      }
    }, this.timeout);
  }

  private handleClosed() {
    clearTimeout(this._timeoutHandle);
  }

  override async handleShow(): Promise<boolean> {
    this.style.display = 'flex';
    await this.animateOpen();
    return true;
  }

  override async handleClose(): Promise<boolean> {
    await this.animateClose();
    this.style.display = 'none';
    return true;
  }

  override async animateOpen(): Promise<void> {
    this.cancelAnimations();
    this.animateHost(true);
    await this.animationsPromise();
  }

  override async animateClose(): Promise<void> {
    this.cancelAnimations();
    this.animateHost(false);
    await this.animationsPromise();
  }

  private async animateHost(open: boolean) {
    const opacity = open ? [0, 1] : [1, 0];
    const height = open ? ['0px', '48px'] : ['48px', '0px'];
    const easing = open
      ? EASING.emphasized.decelerate
      : EASING.standard.accelerate;
    this.animations.push(
      this!.animate(
        {
          opacity,
          height,
        },
        {
          duration: 300,
          easing,
          fill: 'forwards',
        }
      )
    );
  }

  override render() {
    return html` <div class="container"></div>
      <md-elevation level="3"></md-elevation>
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <slot name="action" @slotchange=${this.onSlotChange}></slot>
      </div>`;
  }

  private onSlotChange() {
    this.hasAction = this._actionElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-snackbar': MdSnackbarElement;
  }
}
