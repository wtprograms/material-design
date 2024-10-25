import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'md-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [BadgeComponent],
  host: {
    '[style.--md-comp-icon-filled]': 'filled() ? 1 : null',
    '[style.--md-comp-icon-size]': 'size() ?? null',
  },
})
export class IconComponent extends MaterialDesignComponent {
  readonly filled = model(false);
  readonly size = model<number>();
  readonly badgeDot = model(false);
  readonly badgeNumber = model<number>();
  readonly slot = model<string>();
}
