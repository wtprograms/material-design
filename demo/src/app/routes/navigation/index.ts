import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, signal, viewChild } from '@angular/core';
import { MdNavigationElement, NavigationLayout } from '../../../../../material-design/dist';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4'
  }
})
export default class Page {
  readonly layouts: NavigationLayout[] = [
    'bar',
    'rail',
    'drawer',
  ];
  readonly layout = signal<NavigationLayout>('bar');
  readonly embedded = signal(true);
  readonly navigation = viewChild<ElementRef<MdNavigationElement>>('navigation');

  next() {
    const currentIndex = this.layouts.indexOf(this.layout());
    this.layout.set(this.layouts[(currentIndex + 1) % this.layouts.length]);
  }

  embed() {
    this.navigation()!.nativeElement.open = true;
    setTimeout(() => this.embedded.set(true), 5000);
  }
}