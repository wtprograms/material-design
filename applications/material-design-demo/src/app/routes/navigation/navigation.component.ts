import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, viewChild } from '@angular/core';
import { MdNavigationElement } from '../../../../../../libraries/material-web/dist';

@Component({
  templateUrl: './navigation.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class NavitationComponent {
  readonly navigation = viewChild<ElementRef<MdNavigationElement>>('navigation');

  onChange() {
    if (this.navigation()!.nativeElement.layout === 'drawer') {
      this.navigation()!.nativeElement.layout = 'bar';
    } else if (this.navigation()!.nativeElement.layout === 'bar') {
      this.navigation()!.nativeElement.layout = 'rail';
    } else {
      this.navigation()!.nativeElement.layout = 'drawer';
    }
  }
}
