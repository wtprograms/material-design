import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  effect,
  inject,
  model,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CardComponent,
  ListComponent,
  SlotDirective,
  DividerComponent,
  MaterialDesignComponent,
  ListItemComponent,
} from '@wtprograms/material-design';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [CardComponent, ListComponent, SlotDirective, DividerComponent],
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
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }
}
