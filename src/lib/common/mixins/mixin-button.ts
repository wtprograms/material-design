import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { FormSubmitterType, setupFormSubmitter } from '../behaviors/form-submission';
import { MixinBase, MixinReturn } from './mixin';
import { property$ } from '../lit/property$.decorator';
import { Observable } from 'rxjs';
import { internals, mixinElementInternals, WithElementInternals } from './mixin-internals';

export type AnchorTarget = '' | '_blank' | '_self' | '_parent' | '_top';

export interface Button extends WithElementInternals {
  type: FormSubmitterType;
  href: string | null;
  target: AnchorTarget;
  value: string | null;
  disabled: boolean;
  disabled$: Observable<boolean>;
  renderAnchorOrButton(content: unknown): unknown;
}

export function mixinButton<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Button> {
  const _base = mixinElementInternals(base);
  abstract class Mixin extends _base implements Button {
    @property({ type: String })
    type: FormSubmitterType = 'button';

    @property({ type: String })
    href: string | null = null;

    @property({ type: String })
    target: AnchorTarget = '';

    @property({ type: String })
    value: string | null = null;

    @property({ type: Boolean, reflect: true })
    @property$()
    disabled = false;
    disabled$!: Observable<boolean>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
      this.addEventListener('click', this.handleClick);
    }

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
      return html`<button id="control" type=${this.type} value=${this.value}>
        <div class="touch"></div>
        ${content}
      </button>`;
    }

    private async handleClick(event: Event) {
      const {type, [internals]: elementInternals} = this;
      const {form} = elementInternals;
      if (!form || type === 'button') {
        return;
      }

      // Wait a full task for event bubbling to complete.
      await new Promise<void>((resolve) => {
        setTimeout(resolve);
      });

      if (event.defaultPrevented) {
        return;
      }

      if (type === 'reset') {
        form.reset();
        return;
      }

      // form.requestSubmit(submitter) does not work with form associated custom
      // elements. This patches the dispatched submit event to add the correct
      // `submitter`.
      // See https://github.com/WICG/webcomponents/issues/814
      form.addEventListener(
        'submit',
        (submitEvent) => {
          Object.defineProperty(submitEvent, 'submitter', {
            configurable: true,
            enumerable: true,
            get: () => this,
          });
        },
        {capture: true, once: true},
      );

      elementInternals.setFormValue(this.value);
      form.requestSubmit();
    }
  }

  return Mixin;
}
