import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Observable } from 'rxjs';
import { ObservableElement } from '../lit/observable-element';

export interface BadgeElement {
  badgeDot: boolean;
  badgeDot$: Observable<boolean>;
  badgeNumber: number | null;
  badgeNumber$: Observable<number | null>;
  renderBadge(): unknown;
  renderBadge(embedded: boolean): unknown;
}

export function mixinBadge<T extends MixinBase<ObservableElement>>(
  base: T
): MixinReturn<T, BadgeElement> {
  abstract class Mixin extends base implements BadgeElement {
    @property({ type: Boolean, attribute: 'badge-dot' })
    badgeDot = false;
    badgeDot$!: Observable<boolean>;

    @property({ type: Number, attribute: 'badge-number' })
    badgeNumber: number | null = null;
    badgeNumber$!: Observable<number | null>;

    renderBadge(): unknown;
    renderBadge(embedded = false): unknown {
      return this.badgeDot || this.badgeNumber !== null
        ? html`<md-badge
            ?dot=${this.badgeDot}
            number=${ifDefined(this.badgeNumber)}
            ?embedded=${embedded}
          ></md-badge>`
        : nothing;
    }
  }

  return Mixin;
}
