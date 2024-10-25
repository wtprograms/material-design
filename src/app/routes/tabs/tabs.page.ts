import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import { TabComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/tab/tab.component';
import { TabsComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/tabs/tabs.component';
import { IconComponent } from "../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component";
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './tabs.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SelectorListItemComponent,
    TabComponent,
    TabsComponent,
    IconComponent,
    CommonModule
],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly secondary = signal(false);
  readonly disabled = signal(false);
  readonly icon = signal(true);
  readonly label = signal(true);
}
