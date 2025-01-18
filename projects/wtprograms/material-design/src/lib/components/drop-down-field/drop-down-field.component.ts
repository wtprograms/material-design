import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge } from 'rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdFieldModule } from '../field/field.module';
import { MdFieldTrailingDirective } from '../field/field-trailing.directive';
import { FieldVariant } from '../field/field-variant';
import { MdFieldComponent } from '../field/field.component';
import { MdIconComponent } from '../icon/icon.component';
import { MdListComponent } from '../list/list.component';
import { MdDropDownFieldSelectedDirective } from './drop-down-field-selected.directive';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';
import { MdListItemComponent } from '../list/list-item/list-item.component';

@Component({
  selector: 'md-drop-down-field',
  templateUrl: './drop-down-field.component.html',
  styleUrls: ['./drop-down-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdFieldModule, MdListComponent, MdIconComponent],
  host: {
    tabindex: '0',
    '(keydown.ArrowDown)': 'arrowDown($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdDropDownFieldComponent),
    },
  ],
})
export class MdDropDownFieldComponent extends MdValueAccessorComponent<
  number | string | boolean
> {
  readonly variant = input<FieldVariant>('filled');
  readonly label = input<string>();
  readonly prefixText = input<string>();
  readonly suffixText = input<string>();

  readonly selected = contentChild(MdDropDownFieldSelectedDirective);
  readonly trailing = contentChild(MdFieldTrailingDirective);

  readonly field = viewChild.required(MdFieldComponent);

  readonly populated = computed(
    () => !!this.value() || this.field().open() || this.focused()
  );

  readonly listItems = contentChildren(MdListItemComponent);

  readonly focused = toSignal(
    merge(
      fromEvent(this.hostElement, 'focus').pipe(map(() => true)),
      fromEvent(this.hostElement, 'blur').pipe(map(() => false))
    ),
    {
      initialValue: false,
    }
  );

  private readonly _changeDetectionRef = inject(ChangeDetectorRef);

  constructor() {
    super();
    effect(() => {
      const listItems = this.listItems();
      for (const listItem of listItems) {
        listItem.interactive.set(true);
        listItem.hostElement.addEventListener('click', () => {
          this.field().open.set(false);
          this.value.set(listItem.value());
          this._changeDetectionRef.detectChanges();
        });
      }
    });
    effect(() => {
      const value = this.value();
      const listItems = this.listItems();
      if (listItems.length === 0) {
        return;
      }
      for (const listItem of listItems) {
        listItem.selected.set(value === listItem.value());
      }
    });
  }

  arrowDown(event: Event) {
    event.preventDefault();
    this.field().open.set(true);
  }

  bodyClick() {
    this.field().open.set(true);
  }
}
