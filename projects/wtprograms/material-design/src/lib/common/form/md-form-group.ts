import {
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { SignalControl } from './signal-control';

export class MdFormGroup<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
  } = any
> extends FormGroup<TControl> {
  readonly signals = new SignalControl(this);
}

