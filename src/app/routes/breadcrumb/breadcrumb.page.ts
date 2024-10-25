import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { BreadcrumbComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/breadcrumb/breadcrumb.component';

@Component({
  templateUrl: './breadcrumb.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, ListItemComponent, CardComponent, CheckComponent, BreadcrumbComponent],
  host: {
    class: 'tw w-full'
  }
})
export default class Page {
  
}
