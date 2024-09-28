import { html, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import {
  animateElement,
  attribute,
  DURATION,
  EASING,
  mixinAttachable,
  mixinDialog,
  mixinStringValue,
  ObservableElement,
} from '../../common';
import { MdPopoverElement } from '../popover';
import { BehaviorSubject, combineLatest, filter, map, of, tap } from 'rxjs';
import { live } from 'lit/directives/live.js';

const base = mixinAttachable(mixinStringValue(mixinDialog(ObservableElement)));

@customElement('md-search-dialog')
export class MdSearchDialogElement extends base {
  static override styles = [styles];

  @property({ type: String })
  placeholder = 'Search';

  @query('input')
  private _input!: HTMLInputElement;

  @queryAssignedElements({ slot: 'header' })
  private _headerSlots!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  header = false;

  override get openComponent$() {
    return of({}).pipe(
      tap(() => {
        document.body.style.overflow = 'hidden';
        this.dialog.showModal();
        this._input.focus();
      }),
      animateElement(
        () => this.animateScrim(true),
        () => this.animateContainer(true)
      )
    );
  }

  override get closeComponent$() {
    return of({}).pipe(
      animateElement(
        () => this.animateScrim(false),
        () => this.animateContainer(false)
      ),
      tap(() => {
        document.body.style.overflow = '';
        this.dialog.close();
      })
    );
  }

  constructor() {
    super();
    this.initialize('click');
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.event$
      .pipe(
        filter((x) => x.type === 'click'),
        tap(() => this.openComponent())
      )
      .subscribe();
  }

  override render() {
    return this.renderDialog();
  }


  override renderContent() {
    return html`${this.renderInput()} ${this.renderBody()}`;
  }

  private renderInput() {
    return html`<div class="input">
        <md-icon-button tab-index="-1" @click=${() => this.closeComponent()}
          >arrow_back</md-icon-button
        >
        <input placeholder=${this.placeholder} .value=${live(this.value)} />
        <md-icon>search</md-icon>
      </div>`;
  }

  private renderBody() {
    return html` <div class="header">
        <slot
          name="header"
          @slotchange=${() => (this.header = !!this._headerSlots.length)}
        ></slot>
      </div>
      <div class="scroller">
        <div class="content">
          <slot></slot>
        </div>
      </div>`;
  }

  private animateContainer(opening: boolean): Animation {
    let transform = ['translateY(-50%)', 'translateY(0)'];
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
    'md-search-dialog': MdSearchDialogElement;
  }
}
