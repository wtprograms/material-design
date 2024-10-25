import {
  ChangeDetectorRef,
  Directive,
  inject,
  AfterViewInit,
} from '@angular/core';
import { MaterialDesignValueAccessorComponent } from '../components/material-design-value-accessor.component';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formGroup]',
  standalone: true,
})
export class FormGroupResetterDirective implements AfterViewInit {
  private readonly _formGroup = inject(FormGroupDirective);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this._formGroup.statusChanges?.subscribe(() =>
      this._changeDetectorRef.detectChanges()
    );
    const resetPrevious = this._formGroup.form.reset.bind(this._formGroup.form);
    this._formGroup.form.reset = (value?: unknown) => {
      resetPrevious.call(this._formGroup, value);
      for (const directive of this._formGroup.directives) {
        if (
          directive.valueAccessor instanceof
          MaterialDesignValueAccessorComponent
        ) {
          directive.control.markAsPristine();
          directive.control.markAsUntouched();
          directive.valueAccessor.errorText.set(undefined);
        }
      }
    };
  }
}
