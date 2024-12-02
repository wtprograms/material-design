import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { MdFieldModule } from '../field/field.module';
import { MdValueAccessorComponent } from '../md-value-accessor.component';
import { MdFieldUserDirective } from '../field/field-user.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, merge, switchMap } from 'rxjs';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdPopoverComponent } from '../popover/popover.component';
import { MdListModule } from '../list/list.module';
import { durationToMilliseconds } from '../../common/motion/duration';
import { MdListItemComponent } from '../list/list-item/list-item.component';

export type TextFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea';

@Component({
  selector: 'md-text-field',
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdFieldModule, FormsModule, MdPopoverComponent, MdListModule],
  hostDirectives: [
    {
      directive: MdFieldUserDirective,
      inputs: ['variant', 'label', 'prefix', 'suffix', 'supportingText'],
    },
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdTextFieldComponent),
    },
  ],
})
export class MdTextFieldComponent extends MdValueAccessorComponent<string> {
  readonly fieldUser = inject(MdFieldUserDirective);

  readonly type = input<TextFieldType>('text');
  readonly input = output<InputEvent>();
  readonly beforeInput = output<InputEvent>();
  readonly maxLength = input<number>();
  readonly min = input<number>();
  readonly max = input<number>();
  readonly showCounter = input(false);
  readonly open = model(false);

  readonly count = computed(() => {
    const value = this.value() ?? '';
    if (!this.showCounter()) {
      return '';
    }
    return this.maxLength()
      ? `${value.length}/${this.maxLength()}`
      : `${value.length}`;
  });

  private readonly _input = viewChild<ElementRef<HTMLInputElement>>('input');

  private readonly _focused = toSignal(
    toObservable(this._input).pipe(
      filter((x) => !!x),
      switchMap((input) =>
        merge(
          fromEvent(input.nativeElement, 'focus').pipe(map(() => true)),
          fromEvent(input.nativeElement, 'blur').pipe(map(() => false))
        )
      )
    )
  );

  readonly populated = computed(() => {
    return this._focused() || !!this.value();
  });

  private readonly _listItems = contentChildren(MdListItemComponent);

  constructor() {
    super();
    effect(() => {
      const listItems = this._listItems();
      if (!listItems?.length) {
        return;
      }
      for (const item of listItems) {
        item.interactive.set(true);
        item.hostElement.addEventListener('click', (event) => {
          this.value.set(item.value() + '');
          event.stopPropagation();
          this.open.set(false);
        });
      }
    });
    effect(() => {
      const value = this.value();
      const listItems = this._listItems();
      if (!listItems) {
        return;
      }
      for (const item of listItems) {
        item.selected.set(item.value() === value);
      }
    });
    effect(() => {
      const value = this.value();
      const listItems = this._listItems();
      for (const item of listItems) {
        if (value === item.value()) {
          item.selected.set(true);
        }
        if (
          value === '' ||
          item
            .value()
            ?.toString()
            .includes(value ?? '')
        ) {
          item.hostElement.style.display = '';
        } else {
          item.hostElement.style.display = 'none';
        }
      }
    });
    effect(() => {
      const open = this.open();
      const listItems = this._listItems();
      const selectedListItem = listItems.find((x) => x.selected());
      setTimeout(() => {
        if (open && selectedListItem) {
          selectedListItem.hostElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
            inline: 'nearest',
          });
        }
      }, durationToMilliseconds('short4'));
    });
    effect(() => {
      const focused = this._focused();
      const listItems = this._listItems();
      if (focused && listItems.length) {
        this.open.set(true);
      }
    });
  }

  inputContainerClick() {
    this._input()?.nativeElement.focus();
  }

  textInput(event: Event) {
    this.input.emit(event as InputEvent);
    if (event.defaultPrevented) {
      return;
    }
    this._input()!.nativeElement.style.height = 'auto';
    if (this.type() === 'textarea') {
      this._input()!.nativeElement.style.height =
        this._input()!.nativeElement.scrollHeight + 'px';
    }
    if (this._listItems().length && !this.open()) {
      this.open.set(true);
    }
  }

  inputBlur() {
    if (this.type() !== 'number') {
      return;
    }
    const textValue = this.value() ?? '0';
    let numberValue = parseInt(textValue);
    if (isNaN(numberValue)) {
      numberValue = 0;
    }

    if (this.min()) {
      numberValue = Math.max(numberValue, this.min()!);
    }
    if (this.max()) {
      numberValue = Math.min(numberValue, this.max()!);
    }

    this.value.set(numberValue.toString());
  }

  textBeforeInput(event: Event) {
    this.beforeInput.emit(event as InputEvent);
  }
}
