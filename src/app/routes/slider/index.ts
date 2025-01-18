import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppModule } from '../../components/app-components';
import { ControlState, MdSliderModule } from '@wtprograms/material-design';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdSliderModule],
})
export default class Page {
  readonly state = options<ControlState>(
    undefined,
    'error',
    'warning',
    'success'
  );
  readonly range = signal(false);
  readonly ticks = signal(false);
}
