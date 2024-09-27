import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { FormSubmitterType } from '../behaviors/form-submission';
import { MixinBase, MixinReturn } from './mixin';
import { Observable } from 'rxjs';
import { ObservableElement } from '../lit/observable-element';

export type AnchorTarget = '' | '_blank' | '_self' | '_parent' | '_top';

export interface ButtonElement {
  type: FormSubmitterType;
  href: string | null;
  target: AnchorTarget | null;
  value: string;
  name: string;
  disabled: boolean;
  disabled$: Observable<boolean>;
  get idName(): string;
  renderAnchorOrButton(content: unknown): unknown;
}

export function mixinButton<T extends MixinBase<ObservableElement>>(
  base: T
): MixinReturn<T, ButtonElement> {
  abstract class Mixin extends base implements ButtonElement {
    @property({ type: String })
    type: FormSubmitterType = 'button';

    @property({ type: String, reflect: true })
    href: string | null = null;

    @property({ type: String, reflect: true })
    target: AnchorTarget | null = null;

    @property({ type: String })
    value = '';

    @property({ type: String })
    name = '';

    @property({ type: Boolean, reflect: true })
    disabled = false;
    disabled$!: Observable<boolean>;

    get idName() {
      return this.href ? 'anchor' : 'button';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
    }

    renderAnchorOrButton(content: unknown = nothing) {
      return this.href
        ? this.renderAnchor(content)
        : this.renderButton(content);
    }

    private renderAnchor(content: unknown = nothing) {
      return this.href
        ? html`<a
            id="anchor"
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
      return html`<button id="button" type=${this.type} value=${this.value} name=${this.name}>
        <div class="touch"></div>
        ${content}
      </button>`;
    }
  }

  return Mixin;
}
