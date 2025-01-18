import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdAvatarModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdAvatarModule],
})
export default class Page {
  readonly disabled = signal(false);
  readonly interactive = signal(false);
  readonly anchor = signal(false);
  readonly image = signal(false);
  readonly size = options(undefined, 24, 80, 120);
}
