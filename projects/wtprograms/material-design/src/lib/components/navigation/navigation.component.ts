import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { ElevationComponent } from '../elevation/elevation.component';
import { NavigationItemComponent } from '../navigation-item/navigation-item.component';

export type NavigationLayout = 'drawer' | 'rail' | 'bar';

@Component({
  selector: 'md-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [ElevationComponent],
  hostDirectives: [],
  host: {
    '[attr.layout]': 'layout()',
  },
})
export class NavigationComponent extends MaterialDesignComponent {
  readonly layout = model<NavigationLayout>('bar');

  constructor() {
    super();
    this.setSlots(NavigationItemComponent, (x) => x.layout.set(this.layout()));
  }
}
