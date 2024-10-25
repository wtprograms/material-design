import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import { AccordianComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/accordian/accordian.component';

@Component({
  templateUrl: './accordian.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, ListItemComponent, CardComponent, CheckComponent, SelectorListItemComponent, AccordianComponent],
  host: {
    class: 'tw w-full'
  }
})
export default class Page {
  readonly open = signal(false);
}
