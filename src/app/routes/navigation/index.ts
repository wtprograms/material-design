import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdButtonModule,
  MdDividerModule,
  MdIconModule,
  MdNavigationModule,
  MdSheetModule,
  MdNavigationItemComponent,
  NavigationLayout,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppModule,
    MdNavigationModule,
    MdIconModule,
    MdDividerModule,
    CommonModule,
    MdSheetModule,
    MdButtonModule,
  ],
})
export default class Page {
  readonly disabled = signal(false);
  readonly layout = options<NavigationLayout>('bar', 'rail', 'drawer');
  readonly selectedItem = signal<MdNavigationItemComponent | undefined>(
    undefined
  );
  readonly badge = signal(false);
  readonly horizontal = signal(false);
  readonly modal = signal(false);
}
