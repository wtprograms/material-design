import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';

@Component({ template: '' })
export abstract class MdComponent {
  readonly platformId = inject(PLATFORM_ID);
  readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly document = inject(DOCUMENT);
  readonly destroyRef = inject(DestroyRef);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
}
