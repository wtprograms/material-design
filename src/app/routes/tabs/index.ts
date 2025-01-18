import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdIconModule,
  MdTabsModule,
  MdTabComponent,
  TabsLayout,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdTabsModule, MdIconModule],
})
export default class Page {
  readonly disabled = signal(false);
  readonly layout = options<TabsLayout>('primary', 'secondary');
  readonly selectedTab = signal<MdTabComponent | undefined>(undefined);
  readonly badge = signal(false);
  readonly radioValue = signal<number>(1);
}
