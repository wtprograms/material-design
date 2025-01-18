import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-dialog-headline',
  templateUrl: './dialog-headline.component.html',
  styleUrls: ['./dialog-headline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDialogHeadlineComponent extends MdComponent {}
