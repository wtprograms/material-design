import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { MdComponent } from '../../common/base/md.component';

@Component({
  selector: 'md-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.vertical]': 'vertical() ? vertical() : null',
  },
})
export class MdDivider extends MdComponent {
  readonly vertical = input(false);
}
