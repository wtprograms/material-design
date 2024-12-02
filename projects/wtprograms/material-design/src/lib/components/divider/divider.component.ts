import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MdComponent } from '../md.component';

@Component({
  selector: 'md-divider',
  template: ``,
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.vertical]': 'vertical()',
  }
})
export class MdDividerComponent extends MdComponent {
  readonly vertical = input(false);
}