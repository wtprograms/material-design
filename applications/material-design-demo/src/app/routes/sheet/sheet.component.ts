import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import {
  MdNavigationElement,
  MdSheetElement,
} from '../../../../../../libraries/material-web/dist';

@Component({
  templateUrl: './sheet.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class SheetComponent {
  readonly sheet = viewChild<ElementRef<MdSheetElement>>('sheet');

  onChange() {
    const sheet = this.sheet()?.nativeElement!;
    if (sheet.layout === 'start') {
      sheet.layout = 'top';
    } else if (sheet.layout === 'top') {
      sheet.layout = 'end';
    } else if (sheet.layout === 'end') {
      sheet.layout = 'bottom';
    } else {
      sheet.layout = 'start';
    }
  }
}
