import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  model,
  viewChild,
  ElementRef,
  computed,
  Input,
} from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, merge, filter, switchMap, fromEvent, map } from 'rxjs';
import { attachTarget } from '../../directives/attachable.directive';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { FieldComponent, FieldVariant } from '../field/field.component';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { ListComponent } from '../list/list.component';
import { ListItemComponent } from '../list-item/list-item.component';
import { SlotDirective } from '../../directives/slot.directive';
import { CommonModule } from '@angular/common';
import { MaterialDesignComponent } from '../material-design.component';
import { redispatchEvent } from '../../common/events/redispatch-event';

export type TextFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'text-area';

@Component({
  selector: 'md-text-field',
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    FieldComponent,
    FormsModule,
    ListComponent,
    SlotDirective,
    CommonModule,
  ],
  host: {
    '[attr.disabled]': 'disabled() || null',
  },
  hostDirectives: [ForwardFocusDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextFieldComponent),
    },
  ],
})
export class TextFieldComponent extends MaterialDesignValueAccessorComponent<string> {
  override readonly value = model<string>();
  readonly variant = model<FieldVariant>('filled');
  readonly type = model<TextFieldType>('text');
  readonly prefix = model<string>();
  readonly suffix = model<string>();
  readonly label = model<string>();
  readonly supportingText = model<string>();
  readonly minLength = model<number>();
  readonly maxLength = model<number>();
  readonly min = model<number>();
  readonly max = model<number>();
  readonly hasDropdown = model(false);
  readonly counter = model(false);
  readonly hasFooter = model(true);

  @Input()
  selectedItemToTextFn = (value?: string) => value;

  private readonly _input =
    viewChild<ElementRef<HTMLInputElement | HTMLTextAreaElement>>('input');

  private readonly _field = viewChild(FieldComponent);

  readonly counterText = computed(() =>
    this.maxLength() && this._input()?.nativeElement
      ? `${this.value()?.length ?? 0}/${this.maxLength()}`
      : undefined
  );

  readonly focused = toSignal(
    merge(
      toObservable(this._input).pipe(
        filter((x) => !!x?.nativeElement),
        switchMap((x) =>
          fromEvent(x!.nativeElement, 'focus').pipe(map(() => true))
        )
      ),
      toObservable(this._input).pipe(
        filter((x) => !!x?.nativeElement),
        switchMap((x) =>
          fromEvent(x!.nativeElement, 'blur').pipe(map(() => false))
        )
      )
    )
  );

  readonly populated = computed(() => {
    return this.focused() || !!this.value();
  });

  constructor() {
    super();
    attachTarget(ForwardFocusDirective, this._input);
    this.setSlots(ListItemComponent, (x) => {
      x.type.set('button');
      x.selected.set(x.value() === this.value());
    });
  }

  onContentClick() {
    this._input()?.nativeElement.focus();
  }

  onInput(event: Event) {
    if (this.type() === 'text-area') {
      const target = event.target as HTMLTextAreaElement;
      target.style.height = 'auto';
      target.style.height = target.scrollHeight + 'px';
    }
    if (this.hasDropdown()) {
      if (!this._field()?.popover()?.open()) {
        this._field()!.popover()!.open.set(true);
      }
    }
    redispatchEvent(this.hostElement, event);
  }

  onItemClick(event: Event) {
    const item = MaterialDesignComponent.get<ListItemComponent>(event.target);
    this.value.set(this.selectedItemToTextFn(item!.value()));
  }

  onBeforeInput(event: Event) {
    redispatchEvent(this.hostElement, event);
    if (this.type() !== 'number') {
      return;
    }

    const inputEvent = event as InputEvent;
    if (inputEvent.inputType === 'insertText') {
      let textValue =
        (this._input()?.nativeElement.value ?? '') + (inputEvent.data ?? '0');
      let numberValue = parseInt(textValue);
      if (isNaN(numberValue)) {
        numberValue = 0;
      }

      if (this.min()) {
        event.preventDefault();
        numberValue = Math.max(numberValue, this.min()!);
      }
      if (this.max()) {
        event.preventDefault();
        numberValue = Math.min(numberValue, this.max()!);
      }

      this.value.set(numberValue.toString());
    }
  }

  focus() {
    this._input()?.nativeElement.focus();
  }
}
