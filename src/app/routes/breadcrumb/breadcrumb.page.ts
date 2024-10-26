import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  BreadcrumbComponent,
} from '@wtprograms/material-design';

@Component({
  templateUrl: './breadcrumb.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    BreadcrumbComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {}
