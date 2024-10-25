import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import {
  FabComponent,
  FabPalette,
  FabSize,
} from '../../../../projects/wtprograms/material-design/src/lib/components/fab/fab.component';
import { options } from '../../common/options';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './fab.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    FabComponent,
    IconComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly palette = options<FabPalette>(
    'surface',
    'primary',
    'secondary',
    'tertiary',
    'danger',
    'warning',
    'success'
  );
  readonly size = options<FabSize>('medium', 'small', 'large');
  readonly label = signal(true);
  readonly icon = signal(true);
  readonly lowered = signal(false);
  readonly extended = signal(true);
}
