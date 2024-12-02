import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { isDefined } from '../../common/assertion/is-defined';
import { MdBadgeUserDirective } from '../badge/badge-user.directive';
import { MdBadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'md-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdBadgeComponent],
  hostDirectives: [
    {
      directive: MdBadgeUserDirective,
      inputs: ['badgeDot', 'badgeNumber'],
    },
  ],
  host: {
    '[style.--md-comp-icon-filled]': 'filledStyle()',
    '[style.--md-comp-icon-size]': 'sizeStyle()',
  },
})
export class MdIconComponent extends MdComponent {
  readonly badgeUser = inject(MdBadgeUserDirective);
  readonly filled = input<boolean>();
  readonly size = input<number>();

  readonly filledStyle = computed(() =>
    isDefined(this.filled()) ? (this.filled() ? 1 : 0) : ''
  );
  readonly sizeStyle = computed(() =>
    isDefined(this.size()) ? this.size() : ''
  );
}
