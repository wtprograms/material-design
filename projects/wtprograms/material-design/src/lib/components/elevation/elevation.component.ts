import { Component, computed, inject, input } from '@angular/core';
import { MdAttachableDirective } from '../../directives/attachable/attachable.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ElevationLevel } from './elevation-level';
import { MdComponent } from '../../common/base/md.component';

@Component({
  selector: 'md-elevation',
  templateUrl: './elevation.component.html',
  styleUrls: ['./elevation.component.scss'],
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[style.--_box-shadow]': 'boxShadow()',
  },
})
export class MdElevationComponent extends MdComponent {
  private readonly _attachable = inject(MdAttachableDirective);
  readonly level = input<ElevationLevel>(0);
  readonly hoverable = input(true);
  readonly interactive = input(true);

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

  readonly pressed = toSignal(
    this._attachable.targetEvent$.pipe(
      filter(
        (event) =>
          (event.type === 'pointerdown' && this.interactive()) ||
          event.type === 'pointerup' ||
          event.type === 'pointercancel'
      ),
      map((event) => event.type === 'pointerdown')
    )
  );

  readonly boxShadow = computed(() => {
    const hovered = this.hovered();
    const pressed = this.pressed();
    const level = this.level();
    let result = `var(--_${level})`;
    if (hovered && level < 5) {
      result = `var(--_${level + 1})`;
    }
    if (pressed) {
      result = `var(--_${level})`;
    }
    return result;
  });
}