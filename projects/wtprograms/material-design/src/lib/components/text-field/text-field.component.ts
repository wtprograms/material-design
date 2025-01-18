import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  forwardRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap, merge, fromEvent, map, combineLatest } from 'rxjs';
import { TextFieldType } from './text-field-type';
import { FieldVariant } from '../field/field-variant';
import { MdFieldComponent } from '../field/field.component';
import { MdListModule } from '../list/list.module';
import { MdFieldModule } from '../field/field.module';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';
import { MdListItemComponent } from '../list/list-item/list-item.component';

@Component({
  selector: 'md-text-field',
  templateUrl: 'text-field.component.html',
  styleUrls: ['text-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdFieldModule, FormsModule, MdListModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdTextFieldComponent),
    },
  ],
})
export class MdTextFieldComponent extends MdValueAccessorComponent<string> {
  readonly variant = input<FieldVariant>('filled');
  readonly type = input<TextFieldType>('text');
  readonly label = input<string>();
  readonly prefixText = input<string>();
  readonly suffixText = input<string>();
  readonly counter = input(false);
  readonly input = output<Event>();
  readonly beforeInput = output<Event>();
  readonly maxLength = input<number>();
  readonly field = viewChild.required(MdFieldComponent);
  readonly listItems = contentChildren(MdListItemComponent);
  readonly manualPopulated = input(false);
  readonly keyDown = output<KeyboardEvent>();

  readonly matchValue = input<
    (
      fieldValue: string | undefined,
      listItemValue: string | undefined
    ) => boolean
  >(
    (fieldValue, listItemValue) =>
      fieldValue?.toString()?.toLocaleLowerCase() ===
      listItemValue?.toString()?.toLocaleLowerCase()
  );
  readonly includesValue = input<
    (
      fieldValue: string | undefined,
      listItemValue: string | undefined
    ) => boolean
  >(
    (fieldValue, listItemValue) =>
      listItemValue
        ?.toString()
        ?.toLocaleLowerCase()
        ?.includes(fieldValue?.toString()?.toLocaleLowerCase() ?? '') ?? false
  );

  readonly counterText = computed(() => {
    const value = this.value();
    const maxLength = this.maxLength();
    if (!maxLength) {
      return `${value?.length ?? 0}`;
    }

    return `${value?.length ?? 0} / ${maxLength}`;
  });

  readonly inputElement =
    viewChild<ElementRef<HTMLTextAreaElement | HTMLInputElement>>(
      'inputElement'
    );
  readonly _inputFocused$ = toObservable(this.inputElement).pipe(
    filter((input) => !!input),
    switchMap((input) =>
      merge(
        fromEvent(input.nativeElement, 'focus').pipe(map(() => true)),
        fromEvent(input.nativeElement, 'blur').pipe(map(() => false))
      )
    )
  );

  readonly populated = toSignal(
    combineLatest({
      value: toObservable(this.value),
      focused: this._inputFocused$,
      manualPopulated: toObservable(this.manualPopulated),
    }).pipe(
      map(
        ({ value, focused, manualPopulated }) =>
          (!!value && value.length > 0) || focused || manualPopulated
      )
    ),
    {
      initialValue: false,
    }
  );

  constructor() {
    super();
    effect(() => {
      const listItems = this.listItems();
      for (const listItem of listItems) {
        listItem.interactive.set(true);
        listItem.hostElement.addEventListener('click', () => {
          this.field().open.set(false);
          this.value.set(listItem.value()?.toString());
        });
      }
    });
    effect(() => {
      const value = this.value();
      const listItems = this.listItems();
      for (const listItem of listItems) {
        const listItemValue = listItem.value()?.toString();
        listItem.selected.set(this.matchValue()(value, listItemValue));
        if (this.includesValue()(value, listItemValue)) {
          listItem.hostElement.style.display = '';
        } else {
          listItem.hostElement.style.display = 'none';
        }
      }
    });
    this.input.subscribe(() => {
      if (this.listItems().length) {
        this.field().open.set(true);
      }
    });
    effect(() => {
      const open = this.field().open();
      const listItems = this.listItems();
      if (open && listItems.length) {
        const selected = this.listItems().find((item) => item.selected());
        setTimeout(
          () =>
            selected?.hostElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest',
            }),
          25
        );
      }
    });
  }

  override focus(event?: FocusEvent) {
    super.focus(event);
    this.inputElement()?.nativeElement.focus();
    if (this.listItems().length) {
      this.field().open.set(true);
    }
  }

  bodyClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      target.classList.contains('body') ||
      target.classList.contains('content') ||
      target.classList.contains('prefix') ||
      target.classList.contains('suffix') ||
      target.classList.contains('control')
    ) {
      this.inputElement()?.nativeElement.focus();
    }
  }
}
