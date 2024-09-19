import {
  Component,
  ElementRef,
  OnInit,
  effect,
  viewChild,
} from '@angular/core';
import { MdCardElement } from '../../../../../material-design/dist';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4',
  },
})
export default class Page {
  readonly item = viewChild<ElementRef<MdCardElement>>('item');

  constructor() {
    effect(() => {
      const item = this.item();
      if (!item) {
        return;
      }
      setTimeout(() => {
        item.nativeElement.href = '/';
      }, 1000);
    });
  }
}
