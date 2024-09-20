import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinDialog } from '../../common/mixins/mixin-dialog';
import { of, tap } from 'rxjs';
import { EASING, DURATION, animateElement } from '../../common';

export type SheetDock = 'top' | 'end' | 'bottom' | 'start';

const base = mixinDialog(LitElement);

@customElement('md-sheet')
export class MdSheetElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  dock: SheetDock = 'start';

  @property({ type: String })
  headline = '';

  @property({ type: String, reflect: true, attribute: 'supporting-text' })
  supportingText: string | null = null;

  @queryAssignedElements({ slot: 'action', flatten: true })
  private _actionSlots!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  actions = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private _icon!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  icon = false;

  override get openComponent$() {
    return of({}).pipe(
      tap(() => {
        document.body.style.overflow = 'hidden';
        this.dialog.showModal();
      }),
      animateElement(
        () => this.animateScrim(true),
        () => this.animateContainer(true),
      )
    );
  }

  override get closeComponent$() {
    return of({}).pipe(
      animateElement(
        () => this.animateScrim(false),
        () => this.animateContainer(false),
      ),
      tap(() => {
        document.body.style.overflow = '';
        this.dialog.close();
      })
    );
  }

  override render() {
    return this.renderDialog();
  }

  override renderContent(): unknown {
    return html`
      ${this.renderHeader()}
      <div class="scroller">
        <div class="content">
          <slot></slot>
        </div>
      </div>
      <div class="actions">
        <slot
          name="action"
          @slotchange=${() => (this.actions = !!this._actionSlots.length)}
        ></slot>
      </div>
    `;
  }

  private renderHeader() {
    return html`<div class="header">
      <div class="headline">
        <div class="icon">
          <slot
            name="icon"
            @slotchange=${() => (this.icon = !!this._icon.length)}
          ></slot>
        </div>
        ${this.headline}
      </div>
      <div class="supporting-text">${this.supportingText}</div>
    </div>`;
  }

  private animateContainer(opening: boolean): Animation {
    const func =
      this.dock === 'top' || this.dock === 'bottom'
        ? 'translateY'
        : 'translateX';
    const abs = this.dock === 'start' || this.dock === 'top' ? '-' : '';

    let transform = [`${func}(${abs}100%)`, `${func}(0)`];
    let opacity = ['0', '1'];
    const easing = opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = opening ? DURATION.long[1] : DURATION.short[3];
    if (!opening) {
      opacity = opacity.reverse();
      transform = transform.reverse();
    }
    return this.container.animate(
      { opacity, transform },
      { duration, easing, fill: 'forwards' }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-sheet': MdSheetElement;
  }
}
