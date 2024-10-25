import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import {
  Typescale,
  TypescaleComponent,
  TypescaleSize,
} from '../../../../projects/wtprograms/material-design/src/lib/components/typescale/typescale.component';
import { options } from '../../common/options';
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
