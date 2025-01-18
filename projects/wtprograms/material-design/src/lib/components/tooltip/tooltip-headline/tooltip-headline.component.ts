import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-tooltip-headline',
  templateUrl: './tooltip-headline.component.html',
  styleUrls: ['./tooltip-headline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdTooltipHeadlineComponent extends MdComponent {}