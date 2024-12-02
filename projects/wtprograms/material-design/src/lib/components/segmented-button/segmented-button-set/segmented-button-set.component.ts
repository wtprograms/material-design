import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../md.component';

@Component({
  selector: 'md-segmented-button-set',
  templateUrl: './segmented-button-set.component.html',
  styleUrl: './segmented-button-set.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdSegmentedButtonSetComponent extends MdComponent {}
