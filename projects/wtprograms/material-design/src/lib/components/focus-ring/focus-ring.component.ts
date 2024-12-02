import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { MdAttachableDirective } from '../../directives/attachable.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map } from 'rxjs';

@Component({
  selector: 'md-focus-ring',
  template: '',
  styleUrl: './focus-ring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[style.outline-width.px]': 'style()?.outlineWidth',
    '[style.opacity]': 'style()?.opacity',
  },
})
export class MdFocusRingComponent extends MdComponent {
  readonly focusVisible = input(true);
  private readonly _attachable = inject(MdAttachableDirective);
  readonly style = toSignal(
    combineLatest({
      focusVisible: toObservable(this.focusVisible),
      targetElement: toObservable(this._attachable.targetElement),
      event: this._attachable.targetEvent$,
    }).pipe(
      filter(
        ({ event }) => event.type === 'focusin' || event.type === 'focusout'
      ),
      map(({ event, focusVisible, targetElement }) => {
        if (event.type === 'focusout') {
          return false;
        }

        return focusVisible
          ? targetElement.matches(':focus-visible') ?? false
          : true;
      }),
      map((focused) => (focused ? { outlineWidth: 3, opacity: 1 } : undefined))
    )
  );
}
