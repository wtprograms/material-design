import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MdComponent } from '../../common/base/md.component';
import { MdAttachableDirective } from '../../directives/attachable/attachable.directive';

@Component({
  selector: 'md-focus-ring',
  templateUrl: './focus-ring.component.html',
  styleUrls: ['./focus-ring.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[attr.focused]': 'focused() ? "" : null',
  },
})
export class MdFocusRingComponent extends MdComponent {
  private readonly _attachable = inject(MdAttachableDirective);

  readonly focusVisible = input(true);

  readonly focused = toSignal(
    this._attachable.targetEvent$.pipe(
      filter((event) => event.type === 'focusout' || event.type === 'focusin'),
      map(
        (event) =>
          (event.type === 'focusin' && !this.focusVisible()) ||
          (this.focusVisible() &&
            this._attachable.targetElement()?.matches(':focus-visible'))
      )
    )
  );
}
