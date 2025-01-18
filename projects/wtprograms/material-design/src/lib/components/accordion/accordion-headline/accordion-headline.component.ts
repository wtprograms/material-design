import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-accordion-headline',
  templateUrl: './accordion-headline.component.html',
  styleUrls: ['./accordion-headline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdAccordionHeadlineComponent extends MdComponent {}
