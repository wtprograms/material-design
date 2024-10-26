import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  TypescaleComponent,
  Typescale,
  TypescaleSize,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './typescale.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    TypescaleComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly scale = options<Typescale>(
    'display',
    'headline',
    'body',
    'title',
    'label'
  );
  readonly size = options<TypescaleSize>('large', 'medium', 'small');
}
