import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  model,
} from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FormSubmitterType } from '../common/forms/form-submitted-type';

@Directive({
  standalone: true,
})
export class FormSubmitterDirective {
  readonly type = model<FormSubmitterType>();
  readonly href = model<string>();
  private readonly _hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly _formGroup = inject(FormGroupDirective, { optional: true });

  @HostListener('click')
  onClick() {
    if (this.href()) {
      return;
    }

    if (this.type() === 'submit') {
      const form = this._hostElement.closest('form');
      form?.requestSubmit();
    } else if (this.type() === 'reset') {
      this._formGroup?.reset();
    }
  }
}

export function formSubmitter() {
  return inject(FormSubmitterDirective);
}
