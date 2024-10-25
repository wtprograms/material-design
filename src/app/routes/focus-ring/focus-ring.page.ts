import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { FocusRingComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/focus-ring/focus-ring.component';

@Component({
  templateUrl: './focus-ring.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, ListItemComponent, CardComponent, CheckComponent, FocusRingComponent],
  host: {
    class: 'tw w-full'
  }
})
export default class Page {
  readonly focusVisible = signal(false);
}
