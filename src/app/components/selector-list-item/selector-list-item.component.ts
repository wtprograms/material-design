import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/material-design.component';
import { MenuComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/menu/menu.component';
import { MenuItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/menu-item/menu-item.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector-list-item',
  templateUrl: './selector-list-item.component.html',
  styleUrl: './selector-list-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [MenuComponent, MenuItemComponent, ListItemComponent, IconComponent, CommonModule],
  hostDirectives: [],
  host: {
    slot: 'toggler',
  },
})
export class SelectorListItemComponent<T> extends MaterialDesignComponent {
  readonly options = input<T[]>([]);
  readonly selectedValue = model<T | null>(this.options()[0]);
}
