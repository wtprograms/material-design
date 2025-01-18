import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdAvatarModule,
  MdCheckModule,
  MdDividerModule,
  MdIconModule,
  MdIconButtonModule,
  MdListModule,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppModule,
    MdListModule,
    MdIconModule,
    MdAvatarModule,
    MdCheckModule,
    MdIconButtonModule,
    MdDividerModule,
  ],
})
export default class Page {
  readonly disabled = signal(false);
  readonly badge = signal(false);
  readonly selected = signal(false);
  readonly split = signal(false);
  readonly leading = options('none', 'avatar', 'icon', 'image');
  readonly trailing = options('none', 'icon', 'icon-button', 'check');
  readonly switch = signal(false);
  readonly interactive = signal(false);
  readonly top = signal(false);
  readonly large = signal(false);
  readonly supportingText = options('none', 'small', 'large');
}
