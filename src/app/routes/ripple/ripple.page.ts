import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  RippleComponent,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';

@Component({
  templateUrl: './ripple.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    RippleComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly hoverable = signal(false);
  readonly interactive = signal(false);
}
