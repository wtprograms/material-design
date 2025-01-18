import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MdComponent } from '../../common/base/md.component';
import { MdAttachableDirective } from '../../directives/attachable/attachable.directive';

@Component({
  selector: 'md-tint',
  templateUrl: './tint.component.html',
  styleUrls: ['./tint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[attr.hovered]': 'hovered() ? "" : null',
  },
})
export class MdTintComponent extends MdComponent {
  private readonly _attachable = inject(MdAttachableDirective);
  readonly hoverable = input(true);

  readonly hovered = toSignal(
    this._attachable.targetEvent$.pipe(
      filter(
        (event) =>
          (event.type === 'pointerenter' && this.hoverable()) ||
          event.type === 'pointerleave' ||
          event.type === 'pointercancel'
      ),
      map((event) => event.type === 'pointerenter')
    )
  );
}
