import { Component, input } from '@angular/core';

export type NavigationLayout = 'bar' | 'rail' | 'drawer';

@Component({
  selector: 'md-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  host: {
    '[class]': 'layout()',
  }
})
export class MdNavigationComponent {
  readonly layout = input<NavigationLayout>('bar');
}