import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ElevationLevel, MdElevationModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdElevationModule],
})
export default class Page {
  readonly level = options<ElevationLevel>(0, 1, 2, 3, 4, 5);
  readonly hoverable = signal(true);
  readonly interactive = signal(true);
}
