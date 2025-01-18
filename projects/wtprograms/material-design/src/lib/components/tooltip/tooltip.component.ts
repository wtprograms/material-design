import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { MdComponent } from '../../common/base/md.component';
import { Placement } from '@floating-ui/dom';
import { TooltipVariant } from './tooltip-variant';
import { PopoverTrigger } from '../popover/popover-trigger';
import { MdAttachableDirective } from '../../directives/attachable/attachable.directive';
import { MdButtonComponent } from '../button/button.component';
import { MdPopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'md-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  imports: [CommonModule, MdPopoverComponent],
  host: {
    '[attr.variant]': 'variant()',
  },
})
export class MdTooltipComponent extends MdComponent {
  readonly attachable = inject(MdAttachableDirective);
  readonly trigger = input<PopoverTrigger>('hover');
  readonly variant = input<TooltipVariant>('plain');
  readonly flip = input(true);
  readonly shift = input(true);
  readonly offset = input(8);
  readonly openDelay = input(500);
  readonly placement = input<Placement>('bottom');
  readonly open = model(false);
  readonly buttons = contentChildren(MdButtonComponent);

  constructor() {
    super();
    effect(() => {
      const buttons = this.buttons();
      for (const button of buttons) {
        button.hostElement.addEventListener('click', () => this.open.set(false));
        button.variant.set('text');
      }
    });
  }
}
