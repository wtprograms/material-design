import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { MdComponent } from '../md.component';
import {
  MdPopoverComponent,
  PopoverTrigger,
} from '../popover/popover.component';
import { MdAttachableDirective } from '../../directives/attachable.directive';
import { Placement } from '@floating-ui/dom';

@Component({
  selector: 'md-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdPopoverComponent],
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
})
export class MdMenuComponent extends MdComponent {
  readonly attachable = inject(MdAttachableDirective);
  readonly trigger = input<PopoverTrigger>('click');
  readonly placement = input<Placement>('bottom');
  readonly offset = input(8);
  readonly open = model(false);
  readonly useTargetWidth = input(false);
}
