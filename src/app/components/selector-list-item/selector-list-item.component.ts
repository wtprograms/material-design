import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
} from '@angular/core';
import {
  MenuComponent,
  MenuItemComponent,
  ListItemComponent,
  IconComponent,
  MaterialDesignComponent,
} from '@wtprograms/material-design';

@Component({
  selector: 'app-selector-list-item',
  templateUrl: './selector-list-item.component.html',
  styleUrl: './selector-list-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    MenuComponent,
    MenuItemComponent,
    ListItemComponent,
    IconComponent,
    CommonModule,
  ],
  hostDirectives: [],
  host: {
    slot: 'toggler',
  },
})
export class SelectorListItemComponent<T> extends MaterialDesignComponent {
  readonly options = input<T[]>([]);
  readonly selectedValue = model<T | null>(this.options()[0]);
}
