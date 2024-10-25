import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';

@Component({
  selector: 'md-divider',
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  hostDirectives: [],
  host: {
    '[attr.vertical]': 'vertical()',
  },
})
export class DividerComponent extends MaterialDesignComponent {
  readonly vertical = model(false);
}
