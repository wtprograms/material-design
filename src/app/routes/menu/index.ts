import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdMenuModule,
  MdButtonModule,
  MdIconModule,
  MdDividerModule,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdMenuModule, MdButtonModule, MdIconModule, MdDividerModule],
})
export default class Page {
  readonly open = signal(false);
  readonly leading = signal(false);
  readonly trailing = options('none', 'icon', 'shortcut');
  readonly disabled = signal(false);
  readonly selected = signal(false);
  readonly radioValue = signal<number>(1);
}
