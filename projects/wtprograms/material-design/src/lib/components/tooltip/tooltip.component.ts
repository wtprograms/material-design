import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  model,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { MdPopoverComponent } from '../popover/popover.component';
import { MdAttachableDirective } from '../../directives/attachable.directive';
import { MdTooltipActionDirective } from './tooltip-action.directive';

export type TooltipVariant = 'plain' | 'rich';

@Component({
  selector: 'md-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdPopoverComponent],
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[class]': 'variant()',
  },
})
export class MdTooltipComponent extends MdComponent {
  readonly attachable = inject(MdAttachableDirective);
  readonly variant = input<TooltipVariant>('plain');
  private readonly _actions = contentChildren(MdTooltipActionDirective);
  readonly hasActions = computed(() => !!this._actions().length);
  readonly open = model(false);
}
