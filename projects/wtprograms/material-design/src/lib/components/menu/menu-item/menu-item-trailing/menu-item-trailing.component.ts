import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { MdComponent } from '../../../../common/base/md.component';


@Component({
  selector: 'md-menu-item-trailing, [mdMenuItemTrailing]',
  templateUrl: './menu-item-trailing.component.html',
  styleUrls: ['./menu-item-trailing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdMenuItemTrailingComponent extends MdComponent {}