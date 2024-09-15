import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { FormSubmitterType } from '../behaviors/form-submission';
import { MixinBase, MixinReturn } from './mixin';
import { property$ } from '../lit/property$.decorator';
import { Observable } from 'rxjs';

export type AnchorTarget = '' | '_blank' | '_self' | '_parent' | '_top';

export interface Button {
  type: FormSubmitterType;
  href: string | null;
  target: AnchorTarget;
  value: string;
  disabled: boolean;
  disabled$: Observable<boolean>;
  renderAnchorOrButton(content: unknown): unknown;
}

export function mixinButton<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Button> {
  abstract class Mixin extends base implements Button {
    @property({ type: String })
    type: FormSubmitterType = 'button';

    @property({ type: String })
    href: string | null = null;

    @property({ type: String })
    target: AnchorTarget = '';

    @property({ type: String })
    value = '';

    @property({ type: Boolean, reflect: true })
    @property$()
    disabled = false;
    disabled$!: Observable<boolean>;

    renderAnchorOrButton(content: unknown = nothing) {
      return this.href
        ? this.renderAnchor(content)
        : this.renderButton(content);
    }

    private renderAnchor(content: unknown = nothing) {
      return this.href
        ? html`<a
            id="control"
            href="${this.href}"
            target="${this.target}"
            type="${this.type}"
            tabindex="${this.disabled ? '-1' : '0'}"
          >
            <div class="touch"></div>
            ${content}
          </a>`
        : nothing;
    }

    private renderButton(content: unknown = nothing) {
      return html`<button id="control" type="${this.type}" value=${this.value}>
        <div class="touch"></div>
        ${content}
      </button>`;
    }
  }

  return Mixin;
}
