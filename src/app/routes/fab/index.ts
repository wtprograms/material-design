import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';
import { FabSize, MdFabModule, MdIconModule } from '@wtprograms/material-design';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdFabModule, MdIconModule],
})
export default class Page {
  readonly size = options<FabSize>('medium', 'large', 'small');
  readonly lowered = signal(false);
  readonly disabled = signal(false);
  readonly extended = signal(false);
  readonly anchor = signal(false);
  readonly icon = signal(true);
  readonly label = signal(true);
}
