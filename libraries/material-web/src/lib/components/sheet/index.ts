/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, TemplateResult, html, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import style from './index.scss';
import { EASING, mixinDialog } from '../../common';
import { SheetLayout } from './sheet-layout';

const base = mixinDialog(LitElement);

@customElement('md-sheet')
export class MdSheetElement extends base {
  static override styles = [style];

  @property({ type: String, reflect: true })
  layout: SheetLayout = 'start';

  @queryAssignedElements({ slot: 'headline', flatten: true })
  private readonly _headlineElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'supporting-text', flatten: true })
  private readonly _supportingTextElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-headline' })
  hasHeadline = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-supporting-text' })
  hasSupportingText = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-body' })
  hasBody = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-action' })
  hasAction = false;

  override renderContent(): TemplateResult<1> | typeof nothing {
    return html`<div class="handle handle-top"></div>
      <div class="header" ?hidden=${!this.hasHeadline}>
        <span class="headline" ?hidden=${!this.hasHeadline}
          ><slot name="headline" @slotchange=${this.onSlotChange}></slot
        ></span>
        <div class="supporting-text" ?hidden=${!this.hasSupportingText}>
          <slot name="supporting-text" @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
      <div class="body">
        <slot></slot>
      </div>
      <div class="action" ?hidden=${!this.hasAction}>
        <slot name="action" @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="handle handle-bottom"></div>`;
  }

  private onSlotChange() {
    this.hasHeadline = this._headlineElements.length > 0;
    this.hasSupportingText = this._supportingTextElements.length > 0;
    this.hasAction = this._actionElements.length > 0;
  }

  override async animateOpen(): Promise<void> {
    this.cancelAnimations();
    this.animateDialog(true);
    this.animateScrim(true);
    this.animateBody(true);
    await this.animationsPromise();
  }

  override async animateClose(): Promise<void> {
    this.cancelAnimations();
    this.animateDialog(false);
    this.animateScrim(false);
    this.animateBody(false);
    await this.animationsPromise();
  }

  private async animateDialog(open: boolean) {
    const opacity = open ? [0, 1] : [1, 0];
    const easing = open
      ? EASING.emphasized.decelerate
      : EASING.standard.accelerate;

    const translates = {
      top: ['translateY(-100%)', 'translateY(0)'],
      end: ['translateX(100%)', 'translateY(0)'],
      bottom: ['translateY(100%)', 'translateY(0)'],
      start: ['translateX(-100%)', 'translateX(0)'],
    };

    let transform = translates[this.layout];
    if (!open) {
      transform = transform.reverse();
    }

    this.animations.push(
      this.dialog!.animate(
        {
          opacity,
          transform,
        },
        {
          duration: 300,
          easing,
          fill: 'forwards',
        }
      )
    );
  }

  private async animateBody(open: boolean) {
    const opacity = open ? [0, 1] : [1, 0];
    const easing = open
      ? EASING.emphasized.decelerate
      : EASING.standard.accelerate;

    const translates = {
      top: ['translateY(-48px)', 'translateY(0)'],
      end: ['translateX(48px)', 'translateY(0)'],
      bottom: ['translateY(48px)', 'translateY(0)'],
      start: ['translateX(-48px)', 'translateX(0)'],
    };

    let transform = translates[this.layout];
    if (!open) {
      transform = transform.reverse();
    }

    this.animations.push(
      this.body!.animate(
        {
          opacity,
          transform,
        },
        {
          duration: 300,
          easing,
          fill: 'forwards',
        }
      )
    );
  }

  private async animateScrim(open: boolean) {
    const opacity = open ? [0, 0.32] : [0.32, 0];
    const easing = open
      ? EASING.emphasized.decelerate
      : EASING.standard.accelerate;
    const duration = open ? 300 : 150;
    this.animations.push(
      this.scrim!.animate(
        {
          opacity,
        },
        {
          duration,
          easing,
          fill: 'forwards',
        }
      )
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-sheet': MdSheetElement;
  }
}
