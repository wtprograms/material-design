import {
  Component,
  effect,
  HostListener,
  inject,
  model,
  ModelSignal,
} from '@angular/core';
import { MaterialDesignComponent } from './material-design.component';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';
import { GET_VALIDATION_MESSAGE_INJECTION_TOKEN } from '../configuration/get-validation-message.injection-token';

@Component({
  template: '',
})
export abstract class MaterialDesignValueAccessorComponent<
    TValue,
    TElement extends HTMLElement = HTMLElement
  >
  extends MaterialDesignComponent<TElement>
  implements ControlValueAccessor
{
  readonly disabled = model(false);
  readonly errorText = model<string>();
  abstract value: ModelSignal<TValue | undefined>;

  private _onChange?: (value: TValue | undefined) => void;
  private _onTouched?: () => void;
  private _control?: FormControl;
  protected _previousValue?: TValue;

  private readonly _formGroup = inject(FormGroupDirective, { optional: true });
  private readonly _getValidationMessage = inject(
    GET_VALIDATION_MESSAGE_INJECTION_TOKEN
  );

  get formControlName() {
    return this.hostElement.getAttribute('formControlName');
  }

  get control() {
    if (!this._formGroup || !this.formControlName) {
      return undefined;
    }
    if (this._control) {
      return this._control;
    }
    this._control = this._formGroup.control.get(
      this.formControlName
    ) as FormControl;
    this._control.valueChanges.subscribe((value) => {
      this.value.set(value);
      this.invalidate();
    });
    this._control.statusChanges.subscribe(() => this.invalidate());
    return this._control;
  }

  constructor() {
    super();
    effect(() => {
      let value = this.value();
      if (typeof value === 'string' && value === '') {
        value = undefined;
      }
      if (this._previousValue !== value) {
        this._previousValue = value;
        this._onChange?.(value);
        this._control?.markAsDirty();
      }
    });
  }

  writeValue(value: TValue): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: TValue | undefined) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  @HostListener('focus')
  onFocus() {
    this._onTouched?.();
  }

  @HostListener('blur')
  onBlur() {
    this.control?.markAsTouched();
    this.invalidate();
  }

  invalidate() {
    if (!this.control || (!this.control.dirty && !this.control.touched)) {
      return;
    }
    const errors: string[] = [];
    for (const key in this.control.errors) {
      const properties = this.control.errors[key];
      const message = this._getValidationMessage(key, properties);
      if (message) {
        errors.push(message);
      }
    }
    this.errorText.set(errors[0] ?? undefined);
  }
}
