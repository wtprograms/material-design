import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-field-popover-content',
  templateUrl: './field-popover-content.component.html',
  styleUrls: ['./field-popover-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdFieldPopoverContentComponent extends MdComponent {}
