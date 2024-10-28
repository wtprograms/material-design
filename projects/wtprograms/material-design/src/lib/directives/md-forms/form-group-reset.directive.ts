import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  inject,
} from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { MaterialDesignValueAccessorComponent } from '../../components/material-design-value-accessor.component';

@Directive({
  selector: '[formGroup]',
  standalone: true,
})
export class FormGroupResetirective implements AfterViewInit {
  private readonly _formGroup = inject(FormGroupDirective);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this._formGroup.statusChanges?.subscribe(() =>
      this._changeDetectorRef.detectChanges()
    );
    const resetPrevious = this._formGroup.form.reset.bind(this._formGroup.form);
    this._formGroup.form.reset = (value?: any) => {
      this._formGroup.form.markAsPristine({ emitEvent: true, onlySelf: false });
      this._formGroup.form.markAsUntouched({ emitEvent: true, onlySelf: false });
      resetPrevious.call(this._formGroup, value);
      for (const directive of this._formGroup.directives) {
        if (
          directive.valueAccessor instanceof
          MaterialDesignValueAccessorComponent
        ) {
          directive.valueAccessor.invalidate();
        }
      }
    };
  }
}
