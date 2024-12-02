import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';

@Component({
  template: '',
})
export class MdComponent<T extends HTMLElement = HTMLElement> {
  readonly hostElement =
    inject<ElementRef<T>>(ElementRef).nativeElement;
  protected readonly _document = inject(DOCUMENT);
  protected readonly _destroyRef = inject(DestroyRef);
  protected readonly _platformId = inject(PLATFORM_ID);
}
