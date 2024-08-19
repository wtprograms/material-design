import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinField } from '../../common/mixins/mixin-field';

export type TextFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'number'
  | 'textarea';

const base = mixinField(LitElement);

@customElement('md-text-field')
export class MdTextFieldElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true, attribute: 'type' })
  type: TextFieldType = 'text';

  @query('.input')
  input!: HTMLInputElement | HTMLTextAreaElement;

  override render(): unknown {
    return html`${this.renderBody()}${this.renderFooter()}`;
  }

  override renderInput(): unknown {
    return this.type === 'textarea'
      ? html`<textarea
          id="input"
          class="input"
          ?disabled=${this.disabled}
          @focus=${this.onInputFocus}
          @blur=${this.onInputBlur}
          @input=${this.onInput}
          rows="1"
        ></textarea>`
      : html`<input
          id="input"
          class="input"
          ?disabled=${this.disabled}
          @focus=${this.onInputFocus}
          @blur=${this.onInputBlur}
          @input=${this.onInput}
        />`;
  }

  private onInputFocus(): void {
    this.populated = true;
  }

  private onInputBlur(): void {
    this.populated = !!this.value;
  }

  override onControlClick(): void {
    this.input.focus();
  }

  private onInput(event: InputEvent): void {
    const result = this.dispatchEvent(event);
    if (!result) {
      return;
    }
    this.value = (event.target as HTMLInputElement).value;
    if (this.type === 'textarea') {
      this.input.style.height = 'auto';
      this.input.style.height = this.input.scrollHeight + 'px';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-text-field': MdTextFieldElement;
  }
}
