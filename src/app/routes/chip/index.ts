import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdAvatarModule,
  MdChipModule,
  MdIconModule,
  MdIconButtonModule,
} from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdChipModule, MdIconButtonModule, MdAvatarModule, MdIconModule],
})
export default class Page {
  readonly disabled = signal(false);
  readonly selected = signal(false);
  readonly pill = signal(false);
  readonly elevated = signal(false);
  readonly leading = options('none', 'icon', 'img', 'avatar');
  readonly interactive = signal(false);
  readonly anchor = signal(false);
  readonly closable = signal(false);
  readonly trailingButton = signal(false);
}
