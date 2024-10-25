import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { openClose } from '../../common/rxjs/open-close';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'md-accordian',
  templateUrl: './accordian.component.html',
  styleUrl: './accordian.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [IconComponent, ButtonComponent],
  host: {
    '[attr.state]': 'state()',
  },
})
export class AccordianComponent extends MaterialDesignComponent {
  readonly open = model(false);

  private readonly _openClose$ = openClose(this.open, 'short4');
  readonly state = toSignal(this._openClose$);
}
