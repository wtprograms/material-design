import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import {
  SegmentedButtonComponent,
  SegmentedButtonType,
} from '../segmented-button/segmented-button.component';
import { SlotDirective } from '../../directives/slot.directive';

@Component({
  selector: 'md-segmented-button-set',
  templateUrl: './segmented-button-set.component.html',
  styleUrl: './segmented-button-set.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [SlotDirective],
  hostDirectives: [],
  host: {},
})
export class SegmentedButtonSetComponent extends MaterialDesignComponent {
  readonly type = model<SegmentedButtonType>('button');

  constructor() {
    super();
    this.setSlots(SegmentedButtonComponent, (x) => x.type.set(this.type()));
  }
}
