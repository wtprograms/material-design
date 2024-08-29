import { LitElement, TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { FormSubmitterType } from '../behaviors/form-submission';
import { dispatchActivationClick } from '../events/dispatch-activation-click';
import { isActivationClick } from '../events/is-activation-click';
import { AnchorTarget } from '../types/anchor-target';
import { MixinBase, MixinReturn } from './mixin';
import { Control, mixinControl } from './mixin-control';

export interface Button extends Control {
  type: FormSubmitterType;
  href: string | null;
  target: AnchorTarget;
  buttonElement: HTMLElement | null;
  targetId: 'button' | 'anchor';
  renderAnchor(excludeContent?: boolean): unknown;
  renderButton(excludeContent?: boolean): unknown;
  renderAnchorOrButton(excludeContent?: boolean): unknown;
  renderContent(): unknown;
  handleActivationClick(event: MouseEvent): boolean;
}

export function mixinButton<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Button> {
  const controlBase = mixinControl(base);
  abstract class Mixin extends controlBase implements Button {
    @property({ type: String })
    type: FormSubmitterType = 'button';

    @property()
    href: string | null = null;

    @property()
    target: AnchorTarget = '';

    @query('.button')
    readonly buttonElement!: HTMLAnchorElement | HTMLButtonElement | null;

    get targetId(): 'button' | 'anchor' {
      return this.href ? 'anchor' : 'button';
    }

    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener('click', this.handleActivationClick.bind(this));
    }

    override focus() {
      this.buttonElement?.focus();
    }

    override blur() {
      this.buttonElement?.blur();
    }

    renderAnchorOrButton(excludeContent?: boolean) {
      return this.href
        ? this.renderAnchor(excludeContent)
        : this.renderButton(excludeContent);
    }

    renderButton(excludeContent?: boolean): TemplateResult {
      return html`<button
        id="button"
        class="button"
        ?disabled=${this.disabled}
        type=${this.type}
      >
        <div class="touch"></div>
        ${excludeContent ? nothing : this.renderContent()}
      </button>`;
    }

    renderAnchor(excludeContent?: boolean): TemplateResult {
      return html`<a
        id="anchor"
        class="button"
        href=${this.href ?? ''}
        target=${this.target || nothing}
        ><div class="touch"></div>
        ${excludeContent ? nothing : this.renderContent()}
      </a>`;
    }

    renderContent() {
      return html`<slot></slot>`;
    }

    handleActivationClick(event: MouseEvent) {
      if (!isActivationClick(event) || !this.buttonElement) {
        return false;
      }
      this.focus();
      dispatchActivationClick(this.buttonElement);
      return true;
    }
  }

  return Mixin;
}
