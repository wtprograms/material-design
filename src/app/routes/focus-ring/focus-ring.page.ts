import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  FocusRingComponent,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';

@Component({
  templateUrl: './focus-ring.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    FocusRingComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly focusVisible = signal(false);
}
