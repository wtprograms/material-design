import {
  AfterViewInit,
  Component,
  effect,
  HostListener,
  inject,
  model,
  ModelSignal,
  OnInit,
} from '@angular/core';
import { MaterialDesignComponent } from './material-design.component';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlName,
  FormGroupDirective,
} from '@angular/forms';
import { GET_VALIDATION_MESSAGE_INJECTION_TOKEN } from '../configuration/get-validation-message.injection-token';
import { skip, tap } from 'rxjs';

@Component({
  template: '',
})
export abstract class MaterialDesignValueAccessorComponent<
    TValue,
    TElement extends HTMLElement = HTMLElement
  >
  extends MaterialDesignComponent<TElement>
  implements ControlValueAccessor, AfterViewInit
{
  readonly disabled = model(false);
  readonly errorText = model<string>();
  abstract value: ModelSignal<TValue | undefined>;

  private _onChange?: (value: TValue | undefined) => void;
  private _onTouched?: () => void;
  private _control?: FormControl;
  protected _previousValue?: TValue;

  private readonly _controlContainer = inject(ControlContainer, {
    optional: true,
    host: true,
    skipSelf: true,
  });
  private readonly _getValidationMessage = inject(
    GET_VALIDATION_MESSAGE_INJECTION_TOKEN
  );

  get formControlName() {
    return this.hostElement.getAttribute('formControlName');
  }

  get control() {
    return this._control;
  }

  constructor() {
    super();
    effect(
      () => {
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
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngAfterViewInit(): void {
    if (!this._controlContainer || !this.formControlName || this._control) {
      return;
    }
    this._control = this._controlContainer?.control?.get(
      this.formControlName
    ) as FormControl;

    this._control.valueChanges.subscribe((value) => this.value.set(value));
    //this._control.statusChanges.subscribe(() => this.invalidate());
    (this._control as any).invalidate = this.invalidate.bind(this);
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

  private _resetContext = false;

  invalidate() {
    if (!this.control) {
      return;
    }

    if (this.control.pristine && !this._control?.touched || this._resetContext) {
      this.errorText.set(undefined);
      return;
    }
    
    const errors: string[] = [];
    for (const key in this.control.errors) {
      const propertiesOrMessage = this.control.errors[key];
      if (typeof propertiesOrMessage === 'string') {
        errors.push(propertiesOrMessage);
        continue;
      }
      const message = this._getValidationMessage(key, propertiesOrMessage);
      if (message) {
        errors.push(message);
      }
    }
    this.errorText.set(errors[0] ?? undefined);
  }
}
