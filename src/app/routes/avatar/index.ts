import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdAvatarModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';

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
}
