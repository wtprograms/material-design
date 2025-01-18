import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MdComponent } from '../../common/base/md.component';
import { MdEmbeddedBadgeDirective } from '../badge/embedded-badge.directive';
import { MdBadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'md-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdBadgeComponent],
  hostDirectives: [
    {
      directive: MdEmbeddedBadgeDirective,
      inputs: ['dot: badgeDot', 'text: badgeText'],
    },
  ],
  host: {
    '[attr.filled]': 'filled() ? "" : null',
  },
})
export class MdIconComponent extends MdComponent {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly filled = input(false);
}
