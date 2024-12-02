import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  model,
} from '@angular/core';
import { MdFieldModule } from '../field/field.module';
import { MdValueAccessorComponent } from '../md-value-accessor.component';
import { MdFieldUserDirective } from '../field/field-user.directive';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdPopoverComponent } from '../popover/popover.component';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, merge, fromEvent, map, startWith } from 'rxjs';
import { MdIconComponent } from '../icon/icon.component';
import { MdListModule } from '../list/list.module';
import { MdFieldTrailingDirective } from '../field/field-trailing.directive';
import { durationToMilliseconds } from '../../common/motion/duration';
import { MdListItemComponent } from '../list/list-item/list-item.component';

@Component({
  selector: 'md-drop-down-field',
  templateUrl: './drop-down-field.component.html',
  styleUrl: './drop-down-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdFieldModule,
    FormsModule,
    MdIconComponent,
    MdPopoverComponent,
    MdListModule,
    MdFieldTrailingDirective,
  ],
  hostDirectives: [
    {
      directive: MdFieldUserDirective,
      inputs: ['variant', 'label', 'prefix', 'suffix', 'supportingText'],
    },
  ],
  host: {
    '[class.open]': 'open()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdDropDownFieldComponent),
    },
  ],
})
export class MdDropDownFieldComponent extends MdValueAccessorComponent<unknown> {
  readonly fieldUser = inject(MdFieldUserDirective);
  readonly open = model(false);

  readonly populated = toSignal(
    combineLatest({
      focused: merge(
        fromEvent(this.hostElement, 'focus').pipe(
          map(() => true),
          startWith(false)
        ),
        fromEvent(this.hostElement, 'blur').pipe(
          map(() => false),
          startWith(false)
        )
      ),
      value: toObservable(this.value),
      open: toObservable(this.open),
    }).pipe(map(({ focused, value, open }) => focused || !!value || open)),
    {
      initialValue: false,
    }
  );

  private readonly _listItems = contentChildren(MdListItemComponent);

  constructor() {
    super();
    effect(() => {
      const listItems = this._listItems();
      if (!listItems) {
        return;
      }
      for (const item of listItems) {
        item.interactive.set(true);
        item.hostElement.addEventListener('click', (event) => {
          this.value.set(item.value());
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
      const open = this.open();
      const listItems = this._listItems();
      if (!listItems) {
        return;
      }
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
  }

  bodyClick() {
    this.open.set(true);
  }
}
