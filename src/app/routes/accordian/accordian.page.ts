import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  AccordianComponent,
} from '@wtprograms/material-design';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './accordian.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SelectorListItemComponent,
    AccordianComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly open = signal(false);
}
