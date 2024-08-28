import {
  inject,
  ChangeDetectorRef,
  signal,
  ElementRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormControl,
} from '@angular/forms';
import { Control } from '@wtprograms/material-design';

export abstract class ControlValueAccessorBase<T extends Control & HTMLElement>
  implements ControlValueAccessor
{
  protected readonly _elementRef = inject<ElementRef<T>>(ElementRef);
  private _onChange?: (value: string) => void;
  private _onTouch?: () => void;
  protected readonly _formGroup = inject(FormGroupDirective);
  protected readonly _changeDetectorRef = inject(ChangeDetectorRef);

  get control(): FormControl {
    if (this._control) {
      return this._control;
    }
    this._control = this._formGroup.control.get(
      this._elementRef.nativeElement.getAttribute('formControlName') ?? ''
    ) as FormControl;
    this._control.statusChanges.subscribe(() => this.invalidate());
    return this.control;
  }
  private _control?: FormControl;

  abstract value: any;

  abstract disabled: any;

  readonly errorText = signal<string | null>(null);

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(): void {
    this._onChange?.(this.value);
    this.invalidate();
  }

  onTouch(): void {
    this._onTouch?.();
    this.invalidate();
  }

  invalidate(): void {
    const errors = [];
    for (const key in this.control.errors) {
      const element = this.control.errors[key];
      const errorMessage = this.getErrorMessage(key, element);
      if (errorMessage) {
        errors.push(errorMessage);
      }
    }
    this.errorText.set(errors[0] ?? null);
    this._changeDetectorRef.detectChanges();
  }

  private getErrorMessage(key: string, element: any): string | undefined {
    if (typeof element === 'string') {
      return element;
    }

    return undefined;
  }
}
