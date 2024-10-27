import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  HostBinding,
  HostListener,
  model,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextFieldComponent } from '../text-field/text-field.component';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { FieldVariant } from '../field/field.component';
import { SlotDirective } from '@wtprograms/material-design';

@Component({
  selector: 'md-pin-field',
  templateUrl: './pin-field.component.html',
  styleUrl: './pin-field.component.scss',
  standalone: true,
  imports: [TextFieldComponent, SlotDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PinFieldComponent),
    },
  ],
  host: {
    '[attr.supportingText]': `supportingTextSlot()?.any() || null`,
    '[attr.error]': '!!errorText() || null',
  },
})
export class PinFieldComponent extends MaterialDesignValueAccessorComponent<string> {
  override readonly value = model<string>();
  readonly length = model(4);
  readonly variant = model<FieldVariant>('filled');
  private readonly _inputs = viewChildren(TextFieldComponent);

  readonly supportingTextSlot = this.slotDirective('supporting-text');

  constructor() {
    super();
    effect(
      () => {
        const inputs = this._inputs();
        if (inputs.length === 0) {
          return;
        }
        const value = inputs.map((x) => x.value ?? '').join('');
        if (value === this.value()) {
          return;
        }
        this.value.set(value);
      },
      {
        allowSignalWrites: true,
      }
    );
    effect(
      () => {
        const value = this.value() ?? '';
        const inputs = this._inputs();
        if (value.length > inputs.length) {
          return;
        }
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value.set(value[i] ?? '');
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const focused = this._inputs().find((x) => x.focused());
    if (!focused) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      const index = this._inputs().indexOf(focused);
      if (index > 0) {
        this._inputs()[index - 1].focus();
      }
    }
    if (event.key === 'ArrowRight') {
      const index = this._inputs().indexOf(focused);
      if (index < this._inputs().length - 1) {
        this._inputs()[index + 1].focus();
      }
    }
  }

  valueChange(value: string | undefined, field: TextFieldComponent) {
    if (value) {
      const index = this._inputs().indexOf(field);
      if (index < this._inputs().length - 1) {
        this._inputs()[index + 1].focus();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-pin-field': PinFieldComponent;
  }
}
