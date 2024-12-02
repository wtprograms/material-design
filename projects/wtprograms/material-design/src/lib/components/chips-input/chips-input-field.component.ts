import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { MdFieldModule } from '../field/field.module';
import { MdValueAccessorComponent } from '../md-value-accessor.component';
import { MdFieldUserDirective } from '../field/field-user.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, merge, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MdPopoverComponent } from '../popover/popover.component';
import { MdListModule } from '../list/list.module';
import { durationToMilliseconds } from '../../common/motion/duration';
import { CommonModule } from '@angular/common';
import { MdChipComponent } from '../chip/chip.component';
import { MdListItemComponent } from '../list/list-item/list-item.component';

@Component({
  selector: 'md-chips-input-field',
  templateUrl: './chips-input-field.component.html',
  styleUrl: './chips-input-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdFieldModule,
    FormsModule,
    MdPopoverComponent,
    MdListModule,
    CommonModule,
  ],
  hostDirectives: [
    {
      directive: MdFieldUserDirective,
      inputs: ['variant', 'label', 'supportingText'],
    },
  ],
})
export class MdChipsInputFieldComponent extends MdValueAccessorComponent<
  string[]
> {
  readonly fieldUser = inject(MdFieldUserDirective);

  readonly showCounter = input(false);
  readonly open = model(false);
  readonly text = model<string>();

  private readonly _input = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly _popover = viewChild(MdPopoverComponent);

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
    const focused = this._focused();
    const value = this.value() ?? [];
    const open = this.open();
    return focused || value.length > 0 || open;
  });

  private readonly _listItems = contentChildren(MdListItemComponent);
  private readonly _chips = contentChildren(MdChipComponent);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    super();
    effect(() => {
      const chips = this._chips();
      const value = this.value();
      const listItems = this._listItems();
      for (const chip of chips) {
        chip.hostElement.style.display = 'none';
        if (value && value.includes(chip.value() + '')) {
          chip.hostElement.style.display = '';
        }
      }
      for (const item of listItems) {
        if (value && value.includes(item.value() + '')) {
          item.hostElement.style.display = 'none';
        } else {
          item.hostElement.style.display = '';
        }
      }
    });
    effect(() => {
      const listItems = this._listItems();
      const chips = this._chips();
      for (const item of listItems) {
        item.interactive.set(true);
        item.hostElement.addEventListener('click', (event) => {
          const value = this.value() ?? [];
          value.push(item.value() + '');
          this.value.set(value);
          event.stopPropagation();
          this.open.set(false);
          this.text.set(undefined);
          const chip = chips.find((x) => x.value() === item.value());
          chip!.hostElement.style.display = '';
          item.hostElement.style.display = 'none';
          this._popover()?.computePosition();
        });
      }
      for (const chip of chips) {
        chip.closable.set(true);
        chip.close.subscribe((event) => {
          const value = this.value() ?? [];
          value.splice(value.indexOf(chip.value() + ''), 1);
          this.value.set(value);
          chip.hostElement.style.display = 'none';
          const item = listItems.find((x) => x.value() === chip.value());
          item!.hostElement.style.display = '';
          this._popover()?.computePosition();
          this._changeDetectorRef.detectChanges();
          console.log(this.populated());
        });
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
      const value = this.value() ?? [];
      if (focused && listItems.length && value.length !== listItems.length) {
        this.open.set(true);
      }
    });
  }

  inputContainerClick() {
    this._input()?.nativeElement.focus();
  }

  textInput() {
    this._input()!.nativeElement.style.height = 'auto';
    if (this._listItems().length && !this.open()) {
      this.open.set(true);
    }
  }
}
