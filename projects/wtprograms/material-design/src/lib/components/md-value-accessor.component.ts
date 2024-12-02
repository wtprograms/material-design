import { AfterViewInit, Component, effect, inject, model } from '@angular/core';
import { MdComponent } from './md.component';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
} from '@angular/forms';
import { GET_VALIDATION_MESSAGE_INJECTION_TOKEN } from '../common/configuration/get-validation-message.injection-token';
import { assertValue } from '../common/assertion/assert-value';

@Component({
    template: '',
    host: {
        '[class.error]': '!!error()',
        '[attr.disabled]': 'disabled() ? "" : null',
        '(focus)': 'focus($event)',
        '(blur)': 'blur($event)',
    },
})
export abstract class MdValueAccessorComponent<
    TValue = string,
  >
  extends MdComponent
  implements ControlValueAccessor, AfterViewInit
{
  readonly disabled = model(false);
  readonly value = model<TValue>();
  readonly error = model<string | boolean>(false);

  private readonly _controlContainer = inject(ControlContainer, {
    optional: true,
    host: true,
    skipSelf: true,
  });

  get formControlName() {
    return this.hostElement.getAttribute('formControlName');
  }

  private readonly _getValidationMessage = inject(
    GET_VALIDATION_MESSAGE_INJECTION_TOKEN,
  );

  private _control?: AbstractControl;
  private _onChange?: (value: TValue | undefined) => void;
  private _onTouched?: () => void;
  private _previousValue?: TValue;

  constructor() {
    super();
    effect(() => {
      if (!this._control) {
        return;
      }
      let value = this.value();
      if (typeof value === 'string' && value === '') {
        value = undefined;
      }
      if (this._previousValue != value) {
        this._previousValue = value;
        this._onChange?.(value);
        this._control?.markAsDirty();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this._controlContainer || !this.formControlName || this._control) {
      return;
    }
    this._control =
      this._controlContainer?.control?.get(this.formControlName) ?? undefined;
    assertValue(
      this._control,
      `The form control "${this.formControlName}" was not found.`,
    );
    this._control.valueChanges.subscribe((value) => this.value.set(value));
    (this._control as any).invalidate = this.invalidate.bind(this);
  }

  writeValue(value: TValue): void {
    if (value === this.value()) {
      return;
    }
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

  focus(event: FocusEvent) {
    this._onTouched?.();
  }

  blur(event: FocusEvent) {
    this._control?.markAsTouched();
    this.invalidate();
  }

  invalidate() {
    if (!this._control) {
      return;
    }

    if (this._control.pristine && !this._control?.touched) {
      this.error.set(false);
      return;
    }

    const errors: string[] = [];
    for (const key in this._control.errors) {
      const propertiesOrMessage = this._control.errors[key];
      if (typeof propertiesOrMessage === 'string') {
        errors.push(propertiesOrMessage);
        continue;
      }
      const message = this._getValidationMessage(key, propertiesOrMessage);
      if (message) {
        errors.push(message);
      }
    }
    this.error.set(errors[0] ?? false);
  }
}
