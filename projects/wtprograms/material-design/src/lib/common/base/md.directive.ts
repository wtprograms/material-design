import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';

@Directive()
export abstract class MdDirective {
  readonly platformId = inject(PLATFORM_ID);
  readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly document = inject(DOCUMENT);
  readonly destroyRef = inject(DestroyRef);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
}
