import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  forwardRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdTextFieldComponent } from '../text-field/text-field.module';
import { MdChipComponent } from '../chip/chip.component';
import { FieldVariant } from '../field/field-variant';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';
import { MdFieldComponent } from '../field/field.component';

@Component({
  selector: 'md-chips-field',
  templateUrl: './chips-field.component.html',
  styleUrls: ['./chips-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdTextFieldComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdTextFieldComponent),
    },
  ],
})
export class MdChipsFieldComponent extends MdValueAccessorComponent<
  (string | number | boolean)[]
> {
  readonly variant = input<FieldVariant>('filled');
  readonly counterText = input<string>();
  readonly label = input<string>();
  readonly prefixText = input<string>();
  readonly suffixText = input<string>();
  readonly field = viewChild.required(MdFieldComponent);
  readonly text = model('');
  readonly chips = contentChildren(MdChipComponent);
  readonly textField = viewChild.required(MdTextFieldComponent);

  constructor() {
    super();
    effect(() => {
      const chips = this.chips();
      for (const chip of chips) {
        chip.selected.set(true);
        chip.closable.set(true);
        chip.close.subscribe(() => {
          const value = this.value() ?? [];
          const chipValue = chip.value() ?? '';
          const index = value.indexOf(chipValue);
          if (index !== -1) {
            value.splice(index, 1);
            this.value.set(value);
            this.textField().focus();
          }
        });
      }
    });
  }

  keyDown(event: KeyboardEvent) {
    if (!this.text() || event.key !== 'Enter') {
      return;
    }
    const value = this.value() ?? [];
    this.value.set([...value, this.text()]);
    this.text.set('');
  }
}
