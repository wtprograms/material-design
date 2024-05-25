/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, TemplateResult, html, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { AutoResetEvent, EASING, mixinDialog } from '../../common';
import { redispatchEvent } from '../../common/events/redispatch-event';
import style from './index.scss';
import { mixinOpenable } from '../../common/mixins/openable/mixin-openable';

type DialogAnimationArgs =
  | [
      Keyframe[] | PropertyIndexedKeyframes | null,
      number | KeyframeAnimationOptions
    ]
  | [];

interface DialogAnimation {
  dialog: DialogAnimationArgs;
  scrim: DialogAnimationArgs;
  container: DialogAnimationArgs;
  containerPaint: DialogAnimationArgs;
  header: DialogAnimationArgs;
  supportingText: DialogAnimationArgs;
  body: DialogAnimationArgs;
  action: DialogAnimationArgs;
}

const DIALOG_DEFAULT_OPEN_ANIMATION: DialogAnimation = {
  dialog: [
    {
      transform: ['translateY(-50px)', 'translateY(0)'],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 500,
      fill: 'forwards',
    },
  ],
  scrim: [
    {
      opacity: [0, 0.32],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  container: [
    {
      opacity: [0, 1],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  containerPaint: [
    {
      opacity: [0, 1],
      height: ['35%', '100%'],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 500,
      fill: 'forwards',
    },
  ],
  header: [
    {
      opacity: [0, 1],
      transform: ['translateY(-16px)', 'translateY(0)'],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 500,
      fill: 'forwards',
    },
  ],
  supportingText: [
    {
      opacity: [0, 1],
      transform: ['translateY(-24px)', 'translateY(0)'],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 500,
      fill: 'forwards',
    },
  ],
  body: [
    {
      opacity: [0, 1],
      transform: ['translateY(-48px)', 'translateY(0)'],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 500,
      fill: 'forwards',
    },
  ],
  action: [
    {
      opacity: [0, 1],
      transform: ['translateY(-64px)', 'translateY(0)'],
    },
    {
      easing: EASING.emphasized.decelerate,
      duration: 500,
      fill: 'forwards',
    },
  ],
};

const DIALOG_DEFAULT_CLOSE_ANIMATION: DialogAnimation = {
  dialog: [
    {
      transform: ['translateY(0)', 'translateY(-50px)'],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  scrim: [
    {
      opacity: [0.32, 0],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  container: [
    {
      opacity: [1, 0],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  containerPaint: [
    {
      opacity: [1, 0],
      height: ['100%', '35%'],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  header: [
    {
      opacity: [1, 0],
      transform: ['translateY(0)', 'translateY(-16px)'],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  supportingText: [
    {
      opacity: [1, 0],
      transform: ['translateY(0)', 'translateY(-24px)'],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  body: [
    {
      opacity: [1, 0],
      transform: ['translateY(0)', 'translateY(-48px)'],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
  action: [
    {
      opacity: [1, 0],
      transform: ['translateY(0)', 'translateY(-64px)'],
    },
    {
      easing: EASING.emphasized.accelerate,
      duration: 150,
      fill: 'forwards',
    },
  ],
};

const base = mixinDialog(LitElement);

@customElement('md-dialog')
export class MdDialogElement extends base {
  static override styles = [style];

  @query('.header')
  private readonly _header!: HTMLDialogElement | null;

  @query('.supporting-text')
  private readonly _supportingText!: HTMLDivElement | null;

  @query('.action')
  private readonly _action!: HTMLDivElement | null;

  @query('.container')
  private readonly _container!: HTMLDivElement | null;

  @query('.container-paint')
  private readonly _containerPaint!: HTMLDivElement | null;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly _iconElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'headline', flatten: true })
  private readonly _headlineElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'supporting-text', flatten: true })
  private readonly _supportingTextElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'body', flatten: true })
  private readonly _bodyElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-headline' })
  hasHeadline = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-supporting-text' })
  hasSupportingText = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-body' })
  hasBody = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-action' })
  hasAction = false;

  override renderContent(): TemplateResult<1> | typeof nothing {
    return html`<div
        class="header"
        ?hidden=${!this.hasIcon && !this.hasHeadline}
      >
        <span class="icon" ?hidden=${!this.hasIcon}
          ><slot name="icon" @slotchange=${this.onSlotChange}></slot
        ></span>
        <span class="headline" ?hidden=${!this.hasHeadline}
          ><slot name="headline" @slotchange=${this.onSlotChange}></slot
        ></span>
      </div>
      <div class="supporting-text" ?hidden=${!this.hasSupportingText}>
        <slot name="supporting-text" @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="body" ?hidden=${!this.hasBody}>
        <slot name="body" @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="action" ?hidden=${!this.hasAction}>
        <slot name="action" @slotchange=${this.onSlotChange}></slot>
      </div>`;
  }

  private onSlotChange() {
    this.hasIcon = this._iconElements.length > 0;
    this.hasHeadline = this._headlineElements.length > 0;
    this.hasSupportingText = this._supportingTextElements.length > 0;
    this.hasBody = this._bodyElements.length > 0;
    this.hasAction = this._actionElements.length > 0;
  }

  override async animateOpen(): Promise<void> {
    this.cancelAnimations();
    await this.animateDialog(DIALOG_DEFAULT_OPEN_ANIMATION);
    await this.animationsPromise();
  }

  override async animateClose(): Promise<void> {
    this.cancelAnimations();
    await this.animateDialog(DIALOG_DEFAULT_CLOSE_ANIMATION);
    await this.animationsPromise();
  }

  private async animateDialog(animation: DialogAnimation) {
    const elementAndAnimations: Array<
      [HTMLElement | null, DialogAnimationArgs]
    > = [
      [this.dialog, animation.dialog],
      [this.scrim, animation.scrim],
      [this._container, animation.container],
      [this._containerPaint, animation.containerPaint],
      [this._header, animation.header],
      [this._supportingText, animation.supportingText],
      [this.body, animation.body],
      [this._action, animation.action],
    ];

    for (const [element, [frames, options]] of elementAndAnimations) {
      if (!element || !frames) {
        continue;
      }
      this.animations.push(element.animate(frames, options));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-dialog': MdDialogElement;
  }
}
