import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { MdAttachableDirective } from '../../directives/attachable.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map, startWith } from 'rxjs';
import { isDefined } from '../../common/assertion/is-defined';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

const EVENTS = [
  'pointerenter',
  'pointerleave',
  'pointerdown',
  'pointerup',
  'pointercancel',
];

@Component({
  selector: 'md-elevation',
  template: '',
  styleUrl: './elevation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[style.box-shadow]': 'boxShadow()',
  },
})
export class MdElevationComponent extends MdComponent {
  readonly level = input<ElevationLevel>(0);
  readonly hoverable = input(true);
  readonly interactive = input(true);

  private readonly _attachable = inject(MdAttachableDirective);

  readonly boxShadow = toSignal(
    combineLatest({
      event: this._attachable.targetEvent$.pipe(startWith(undefined)),
      level: toObservable(this.level),
    }).pipe(
      map((x) => {
        if (!x.event) {
          return `var(--md-sys-elevation-${x.level})`;
        }
        if (
          (x.event.type === 'pointerenter' || x.event.type === 'pointerup') &&
          (this.hoverable() || this.interactive())
        ) {
          return `var(--md-sys-elevation-${x.level + 1})`;
        }
        if (
          (x.event.type === 'pointerdown' && this.interactive()) ||
          x.event.type === 'pointerleave'
        ) {
          return `var(--md-sys-elevation-${x.level})`;
        }
        return undefined;
      }),
      filter((x) => isDefined(x))
    )
  );
}
