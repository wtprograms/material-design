import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-fab-label',
  templateUrl: './fab-label.component.html',
  styleUrls: ['./fab-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.extended]': 'extended() ? "" : null',
  }
})
export class MdFabLabelComponent extends MdComponent {
  readonly extended = model(false);
}
