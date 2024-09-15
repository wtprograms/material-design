import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  inject,
} from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[formGroup]',
  standalone: true,
})
export class FormGroupInvalidatorDirective implements AfterViewInit {
  private readonly _formGroup = inject(FormGroupDirective);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this._formGroup.statusChanges?.subscribe(() =>
      this._changeDetectorRef.detectChanges()
    );
  }
}
