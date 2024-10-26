import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  SnackBarComponent,
  ButtonComponent,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';

@Component({
  templateUrl: './snack-bar.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SnackBarComponent,
    ButtonComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly closeButton = signal(false);
  readonly action = signal(false);
  readonly multiline = signal(false);
}
