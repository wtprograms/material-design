import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Observable } from 'rxjs';
import { property$ } from '../lit/property$.decorator';

export interface Badge {
  badgeDot: boolean;
  badgeDot$: Observable<boolean>;
  badgeNumber: number | null;
  badgeNumber$: Observable<number | null>;
  renderBadge(): unknown;
  renderBadge(embedded: boolean): unknown;
}

export function mixinBadge<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Badge> {
  abstract class Mixin extends base implements Badge {
    @property({ type: Boolean, attribute: 'badge-dot' })
    @property$()
    badgeDot = false;
    badgeDot$!: Observable<boolean>;

    @property({ type: Number, attribute: 'badge-number' })
    @property$()
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
