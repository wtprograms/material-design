import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { PopoverComponent, PopoverTrigger } from '../popover/popover.component';
import { Placement } from '@floating-ui/dom';
import {
  attach,
  AttachableDirective,
} from '../../directives/attachable.directive';
import { AnimationDirective } from '../../directives/animation/animation.directive';
import { Animator } from '../../directives/animation/animator';
import { ButtonComponent } from '../button/button.component';
import { SlotDirective } from '../../directives/slot.directive';

export type TooltipVariant = 'plain' | 'rich';

@Component({
  selector: 'md-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [PopoverComponent, AnimationDirective, SlotDirective],
  hostDirectives: [
    {
      directive: AttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[attr.variant]': 'variant()',
    '[attr.headline]': `headlineSlot()?.any() || null`,
    '[attr.actions]': `actionSlot()?.any() || null`,
    '[attr.state]': 'state()',
  },
})
export class TooltipComponent extends MaterialDesignComponent {
  readonly variant = model<TooltipVariant>('plain');
  readonly placement = model<Placement>('bottom');
  readonly trigger = model<PopoverTrigger>('hover');
  readonly offset = model(8);
  readonly manualClose = model(false);
  readonly popover = viewChild<PopoverComponent>('popover');
  readonly attachableDirective = inject(AttachableDirective);
  readonly modal = model(false);

  readonly state = computed(() => this.popover()?.state() ?? 'closed');

  readonly headlineSlot = this.slotDirective('headline');
  readonly actionSlot = this.slotDirective('action');

  readonly scrimAnimation = [
    new Animator('opening', {
      keyframes: { opacity: 0.32 },
      options: { easing: 'standardDecelerate' },
    }),
    new Animator('closing', {
      keyframes: { opacity: 0 },
      options: { duration: 'short3', easing: 'standardAccelerate' },
    }),
  ];

  constructor() {
    super();
    attach('pointerenter', 'pointerleave');
    effect(() => {
      const state = this.state();
      const modal = this.modal();
      const target = this.popover()?.attachableDirective?.targetElement();
      if (!target) {
        return;
      }
      if (modal) {
        if (state === 'opening') {
          target.style.zIndex = 'var(--md-sys-z-index-popover)';
        } else if (state === 'closed') {
          target.style.zIndex = '';
        }
      }
    });
    this.setSlots(ButtonComponent, (x) => {
      x.hostElement.slot = 'action';
      x.variant.set('text');
    });
  }

  openTooltip() {
    this.popover()?.open?.set(true);
  }

  closeTooltip() {
    this.popover()?.open?.set(false);
  }

  onActionClick() {
    this.closeTooltip();
  }
}
