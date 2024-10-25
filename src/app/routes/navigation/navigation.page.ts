import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import {
  NavigationComponent,
  NavigationLayout,
} from '../../../../projects/wtprograms/material-design/src/lib/components/navigation/navigation.component';
import { NavigationItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/navigation-item/navigation-item.component';
import { options } from '../../common/options';
import { CommonModule } from '@angular/common';
import { NavigationHeadlineComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/navigation-headline/navigation-headline.component';
import { DividerComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/divider/divider.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './navigation.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    NavigationComponent,
    NavigationItemComponent,
    CommonModule,
    NavigationHeadlineComponent,
    DividerComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly layout = options<NavigationLayout>('bar', 'rail', 'drawer');
  readonly selected = signal(false);
  readonly disabled = signal(false);
  readonly label = signal(true);
  readonly icon = signal(true);
}
