import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdButtonModule,
  MdIconModule,
  MdSheetModule,
  SheetDock,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdSheetModule, MdIconModule, MdButtonModule],
})
export default class Page {
  readonly open = signal(false);
  readonly body = options('short', 'long', 'none');
  readonly actions = signal(true);
  readonly dock = options<SheetDock>('start', 'end', 'top', 'bottom');
  readonly headline = signal(true);
}
