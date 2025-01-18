import { computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlStatus } from '@angular/forms';

export class SignalControl<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
  } = any
> {
  readonly value: Signal<TControl>;
  readonly status: Signal<FormControlStatus>;

  readonly invalid = computed(() => this.status() === 'INVALID');
  readonly valid = computed(() => this.status() === 'VALID');

  constructor(public readonly control: AbstractControl<TControl>) {
    this.value = toSignal(control.valueChanges, { initialValue: control.value });
    this.status = toSignal(control.statusChanges, { initialValue: control.status });
  }
}
