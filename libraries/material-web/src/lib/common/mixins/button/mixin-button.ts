import { LitElement, TemplateResult, html, isServer, nothing } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property, query } from 'lit/decorators.js';
import { Button } from './button';
import { mixinControl } from '../control/mixin-control';
import { AnchorTarget } from '../../types/anchor-target';
import { dispatchActivationClick } from '../../events/dispatch-activation-click';
import { isActivationClick } from '../../events/is-activation-click';
import { FormSubmitterType } from '../../form-submitter/form-submitter-type';

export function mixinButton<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Button> {
  const controlBase = mixinControl(base);
  abstract class MixinButton extends controlBase implements Button {
    @property({ type: String })
    type: FormSubmitterType = 'button';

    @property()
    href = '';

    @property()
    target: AnchorTarget = '';

    @query('.button')
    readonly buttonElement!: HTMLElement | null;

    constructor() {
      super();
      if (!isServer) {
        this.addEventListener('click', this.handleActivationClick.bind(this));
      }
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
        ${excludeContent ? nothing : this.renderContent()}
      </button>`;
    }

    renderAnchor(excludeContent?: boolean): TemplateResult {
      return html`<a
        id="button"
        class="button"
        href=${this.href}
        target=${this.target || nothing}
        >${excludeContent ? nothing : this.renderContent()}
      </a>`;
    }

    renderContent() {
      return html`<div class="touch"></div>
        <slot></slot>`;
    }

    private handleActivationClick(event: MouseEvent) {
      if (!isActivationClick(event) || !this.buttonElement) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.buttonElement);
    }
  }

  return MixinButton;
}
