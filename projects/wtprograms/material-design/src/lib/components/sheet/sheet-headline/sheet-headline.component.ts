import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-sheet-headline',
  templateUrl: './sheet-headline.component.html',
  styleUrls: ['./sheet-headline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdSheetHeadlineComponent extends MdComponent {}
