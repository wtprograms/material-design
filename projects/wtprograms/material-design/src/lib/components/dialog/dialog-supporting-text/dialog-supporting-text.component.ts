import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-dialog-supporting-text',
  templateUrl: './dialog-supporting-text.component.html',
  styleUrls: ['./dialog-supporting-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDialogSupportingTextComponent extends MdComponent {}
