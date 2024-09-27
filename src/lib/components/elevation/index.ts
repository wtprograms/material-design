import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import {
  filter,
  map,
  Observable,
} from 'rxjs';
import { attribute, cssProperty, mixinAttachable, ObservableElement } from '../../common';
import { filterAnyEvent } from '../../common/rxjs/operators/filter-any-event';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

const base = mixinAttachable(ObservableElement);

@customElement('md-elevation')
export class MdElevationElement extends base {
  static override styles = [styles];

  @property({ type: Number })
  level: ElevationLevel = 0;
  level$!: Observable<ElevationLevel>;

  @property({ type: Boolean, reflect: true })
  dragged = false;

  @property({ type: Boolean })
  hoverable = false;

  @property({ type: Boolean })
  interactive = false;

  constructor() {
    super();
    this.initialize(
      'pointerdown',
      'pointerup',
      'pointerenter',
      'pointerleave',
      'pointercancel'
    );
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.level$
      .pipe(cssProperty(this, '--md-comp-elevation-level'))
      .subscribe();
    this.event$
      .pipe(
        filterAnyEvent('pointerenter', 'pointerleave'),
        filter(() => this.hoverable || this.interactive),
        map((event) => event.type === 'pointerenter'),
        attribute(this, 'hovering')
      )
      .subscribe();
    this.event$
      .pipe(
        filterAnyEvent('pointerdown', 'pointerup'),
        filter(() => this.interactive),
        map((event) => event.type === 'pointerdown'),
        attribute(this, 'activated')
      )
      .subscribe();
  }

  override render() {
    return html`<div class="shadow"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-elevation': MdElevationElement;
  }
}
