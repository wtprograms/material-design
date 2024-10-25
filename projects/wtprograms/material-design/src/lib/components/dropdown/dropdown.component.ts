import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  viewChild,
  computed,
  forwardRef,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent, FieldVariant } from '../field/field.component';
import { IconComponent } from '../icon/icon.component';
import { ListComponent } from '../list/list.component';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';

@Component({
  selector: 'md-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FieldComponent, IconComponent, FormsModule, ListComponent],
  hostDirectives: [],
  host: {
    '[attr.disabled]': 'disabled() || null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DropdownComponent),
    },
  ],
})
export class DropdownComponent<
  T
> extends MaterialDesignValueAccessorComponent<T> {
  override readonly value = model<T>();
  readonly variant = model<FieldVariant>('filled');
  readonly prefix = model<string>();
  readonly suffix = model<string>();
  readonly label = model<string>();
  readonly field = viewChild<FieldComponent<T>>('field');

  readonly selectedValueSlot = this.slotDirective('selected-value');

  readonly populated = computed(() => {
    if (this.field()?.popover()?.state() === 'closing' && !this.value()) {
      return false;
    }
    return (
      !!this.value() ||
      this.field()?.open() ||
      this.field()?.popover()?.state() === 'opening'
    );
  });
}
