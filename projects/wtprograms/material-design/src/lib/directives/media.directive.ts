import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ScreenSize } from '../common/screen-size';
import { observeMedia } from '../common/signals/observe-media';

@Directive({
  selector: '[mdMedia]',
})
export class MdMediaDirective {
  private readonly _templateRef = inject(TemplateRef);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  readonly min = input<ScreenSize | number>(0);
  readonly max = input<ScreenSize | number>();

  private readonly _matches = observeMedia(this.min(), this.max());

  constructor() {
    effect(() => {
      this._viewContainerRef.clear();
      if (this._matches()) {
        this._viewContainerRef.createEmbeddedView(this._templateRef);
      }
    });
  }
}
