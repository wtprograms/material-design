import { ChangeDetectionStrategy, Component, contentChildren, effect, input } from '@angular/core';
import { SegmentedButtonType } from '../segmented-button-type';
import { MdSegmentedButtonComponent } from '../segmented-button.component';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-segmented-button-set',
  templateUrl: './segmented-button-set.component.html',
  styleUrls: ['./segmented-button-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdSegmentedButtonSetComponent extends MdComponent {
  readonly type = input<SegmentedButtonType>('button');
  readonly buttons = contentChildren(MdSegmentedButtonComponent);

  constructor() {
    super();
    effect(() => {
      const buttons = this.buttons();
      for (const button of buttons) {
        button.type.set(this.type());
      }
    })
  }
}
