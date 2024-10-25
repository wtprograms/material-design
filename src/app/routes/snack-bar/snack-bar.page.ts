import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { SnackBarComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/snack-bar/snack-bar.component';
import { ButtonComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/button/button.component';

@Component({
  templateUrl: './snack-bar.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, ListItemComponent, CardComponent, CheckComponent, SnackBarComponent, ButtonComponent],
  host: {
    class: 'tw w-full'
  }
})
export default class Page {
  readonly closeButton = signal(false);
  readonly action = signal(false);
  readonly multiline = signal(false);
}
