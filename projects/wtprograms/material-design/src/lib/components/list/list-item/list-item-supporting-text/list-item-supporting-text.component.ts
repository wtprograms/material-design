import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../../../common/base/md.component';

@Component({
  selector: 'md-list-item-supporting-text',
  templateUrl: './list-item-supporting-text.component.html',
  styleUrls: ['./list-item-supporting-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdListItemSupportingText extends MdComponent {}
