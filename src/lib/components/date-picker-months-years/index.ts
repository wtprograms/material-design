import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './styles';
import { EASING, mixinPopup } from '../../common';

const base = mixinPopup(LitElement);

@customElement('md-date-picker-months-years')
export class MdDatePickerMonthsYearsElement extends base {
  static override styles = [styles];

  @property({ type: String })
  locale = 'en';

  @property({ type: Boolean })
  years = false;

  @property({ type: String })
  value = '';

  @state()
  get date(): Date {
    return this.value === '' ? new Date() : new Date(this.value);
  }
  set date(value: Date) {
    this.value = value.toISOString();
  }

  @query('.container')
  private _container!: HTMLElement;

  @query('.body')
  private _body!: HTMLElement;

  override render() {
    const contents = Array.from(this.years ? this.getYears() : this.getMonths());
    return html`<div class="container"></div>
      <md-list class="body"> ${contents} </md-list>`;
  }

  private *getMonths() {
    const format = new Intl.DateTimeFormat(this.locale, { month: 'long' });
    for (let i = 0; i < 12; i++) {
      const date = new Date(this.date.getFullYear(), i, this.date.getDate());
      const valueStr = format.format(date);
      const selected = this.date.getMonth() === i;
      const icon = selected ? 'check' : '';
      yield html`<md-list-item ?selected=${selected} @click=${() => this.setValue(date)}>
        <md-icon slot="leading">${icon}</md-icon>
        ${valueStr}
      </md-list-item>`;
    }
  }

  private *getYears() {
    const date = new Date();
    const minYear = date.getFullYear() - 100;
    const maxYear = date.getFullYear() + 100;
    for (let i = minYear; i < maxYear; i++) {
      const selected = this.date.getFullYear() === i;
      const icon = selected ? 'check' : '';
      const date = new Date(i, this.date.getMonth(), this.date.getDate());
      yield html`<md-list-item ?selected=${selected} @click=${() => this.setValue(date)}>
        <md-icon slot="leading">${icon}</md-icon>
        ${i}
      </md-list-item>`;
    }
  }

  private setValue(date: Date) {
    this.date = date;
    this.dispatchEvent(new CustomEvent('value-change', { bubbles: true }));
    this.close();
  }

  override async showComponent() {
    if (this.open || this.opening) {
      return;
    }
    this.opening = true;
    this.style.display = 'flex';
    this.setAttribute('open', '');
    this.style.opacity = '1';
    await this.animateComponent();
    this.opening = false;
    const selected = this.shadowRoot?.querySelector('md-list-item[selected]');
    selected?.scrollIntoView();
  }

  override async close() {
    if (!this.open || this.closing) {
      return;
    }
    this.closing = true;
    await this.animateComponent();
    this.style.opacity = '';
    this.style.display = '';
    this.removeAttribute('open');
    this.closing = false;
  }

  override *getComponentAnimations(): Generator<Animation | undefined> {
    yield this.animateContainer();
    yield this.animateBody();
  }

  private animateContainer() {
    let transform = ['scaleY(30%)', 'scaleY(100%)'];
    let opacity = ['0', '1'];
    if (this.closing) {
      transform = transform.reverse();
      opacity = opacity.reverse();
    }

    const easing = this.opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = this.opening ? 300 : 150;

    return this._container.animate(
      {
        transform,
        opacity,
      },
      {
        easing,
        duration,
        fill: 'forwards',
      }
    );
  }

  private animateBody() {
    let opacity = ['0', '1'];
    if (this.closing) {
      opacity = opacity.reverse();
    }

    const easing = this.opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = this.opening ? 300 : 50;

    return this._body.animate(
      {
        opacity,
      },
      {
        easing,
        duration,
        fill: 'forwards',
      }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-date-picker-months-years': MdDatePickerMonthsYearsElement;
  }
}
