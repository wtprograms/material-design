import { ChangeDetectionStrategy, Component, contentChildren, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationLayout } from './navigation-layout';
import { MdComponent } from '../../common/base/md.component';

@Component({
  selector: 'md-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  host: {
    '[attr.layout]': 'layout()',
    '[attr.horizontal]': 'horizontal() ? "" : null',
  },
})
export class MdNavigationComponent extends MdComponent {
  readonly layout = input<NavigationLayout>('bar');
  readonly horizontal = input(false);
}
