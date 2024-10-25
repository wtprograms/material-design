import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap, merge, fromEvent, map } from 'rxjs';
import { AttachableDirective } from '../../directives/attachable.directive';
import { MaterialDesignComponent } from '../material-design.component';

@Component({
  selector: 'md-elevation',
  templateUrl: './elevation.component.html',
  styleUrl: './elevation.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  hostDirectives: [
    {
      directive: AttachableDirective,
      inputs: ['events', 'for', 'target'],
    },
  ],
  host: {
    '[style.boxShadow]': 'levelVariable()',
  },
})
export class ElevationComponent extends MaterialDesignComponent {
  readonly level = model(0);
  readonly hoverable = model(true);
  readonly interactive = model(true);
  readonly dragging = model(false);
  readonly attachableDirective = inject(AttachableDirective);

  readonly hovering = toSignal(
    this.attachableDirective.targetElement$.pipe(
      filter((x) => !!x),
      switchMap((x) =>
        merge(fromEvent(x, 'pointerenter'), fromEvent(x, 'pointerleave'))
      ),
      filter(() => this.hoverable() || this.interactive()),
      map((x) => x.type === 'pointerenter')
    )
  );
  readonly activated = toSignal(
    this.attachableDirective.targetElement$.pipe(
      filter((x) => !!x),
      switchMap((x) =>
        merge(fromEvent(x, 'pointerdown'), fromEvent(x, 'pointerup'))
      ),
      filter(() => this.interactive()),
      map((x) => x.type === 'pointerdown')
    )
  );

  readonly levelVariable = computed(() => {
    let level = this.level();
    if (this.dragging()) {
      return 'var(--md-sys-elevation-4)';
    }
    if (this.hovering() && !this.activated()) {
      level += 1;
    }
    return `var(--md-sys-elevation-${level})`;
  });

  constructor() {
    super();
    this.attachableDirective.events.set([
      'pointerenter',
      'pointerleave',
      'pointerdown',
      'pointerup',
    ]);
  }
}
