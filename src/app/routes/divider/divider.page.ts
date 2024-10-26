import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  DividerComponent,
} from '@wtprograms/material-design';

@Component({
  templateUrl: './divider.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    DividerComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly vertical = signal(false);
}
