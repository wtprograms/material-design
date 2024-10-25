import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  effect,
  inject,
  model,
} from '@angular/core';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list/list.component';
import { MaterialDesignComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/material-design.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { ActivatedRoute } from '@angular/router';
import { DividerComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/divider/divider.component';
import { SlotDirective } from '../../../../projects/wtprograms/material-design/src/lib/directives/slot.directive';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    CardComponent,
    ListComponent,
    SlotDirective,
    DividerComponent,
  ],
  host: {
    '[attr.toggler]': 'togglerSlot()?.any() || null',
  },
})
export class PageComponent extends MaterialDesignComponent {
  readonly autoSlot = model(true);
  readonly _activatedRoute = inject(ActivatedRoute);
  
  readonly togglerSlot = this.slotDirective('toggler');

  readonly title = this._activatedRoute.snapshot.title;

  constructor() {
    super();
    effect(
      () => {
        if (!this.autoSlot()) {
          return;
        }
        const items = this.defaultSlot()?.componentsOf(ListItemComponent) ?? [];
        for (const item of items) {
          item.hostElement.slot = 'toggler';
          item.type.set('button');
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }
}
