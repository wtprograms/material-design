import { Directive, effect, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorBase } from './control-value-accessor-base';
import { MdTextFieldElement } from '@wtprograms/material-design';

@Directive({
  selector: 'md-text-field[formControlName]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextFieldControlDirective),
    },
  ],
  host: {
    '(input)': 'onChange()',
    '(blur)': 'onTouch()',
  },
})
export class TextFieldControlDirective extends ControlValueAccessorBase<MdTextFieldElement> {
  get value(): any {
    return this._elementRef.nativeElement.value;
  }
  set value(value: any) {
    this._elementRef.nativeElement.value = value;
  }

  get disabled(): any {
    return this._elementRef.nativeElement.disabled;
  }
  set disabled(value: any) {
    this._elementRef.nativeElement.disabled = value;
  }

  constructor() {
    super();
    effect(() => {
      const errorText = this.errorText();
      this._elementRef.nativeElement.errorText = errorText;
    });
  }
}
