import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  model,
  contentChildren,
  effect,
} from '@angular/core';
import { Placement } from '@floating-ui/dom';
import { MdMenuItemComponent } from './menu-item/menu-item.component';
import { MdComponent } from '../../common/base/md.component';
import { MdPopoverModule } from '../popover/popover.module';
import { PopoverTrigger } from '../popover/popover-trigger';
import { MdAttachableDirective } from '../../directives/attachable/attachable.directive';

@Component({
  selector: 'md-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  imports: [MdPopoverModule],
})
export class MdMenuComponent extends MdComponent {
  readonly attachable = inject(MdAttachableDirective);
  readonly trigger = input<PopoverTrigger>('click');
  readonly flip = input(true);
  readonly shift = input(true);
  readonly offset = input(8);
  readonly placement = input<Placement>('bottom');
  readonly open = model(false);
  readonly subItems = contentChildren(MdMenuItemComponent);

  constructor() {
    super();
    effect(() => {
      const open = this.open();
      if (open) {
        return;
      }
      const subItems = this.subItems();
      for (const subItem of subItems) {
        subItem.subMenu()?.open.set(false);
      }
    });
  }
}
