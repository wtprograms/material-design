import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  DialogComponent,
  ButtonComponent,
  IconComponent,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './dialog.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    DialogComponent,
    ButtonComponent,
    IconComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly icon = signal(true);
  readonly headline = signal(true);
  readonly supportingText = signal(true);
  readonly actions = signal(true);
  readonly bodyText = options('short', 'long', undefined);
}
