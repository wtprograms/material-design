import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AttachableDirective } from '../../directives/attachable.directive';
import { MaterialDesignComponent } from '../material-design.component';

@Component({
  selector: 'md-focus-ring',
  templateUrl: './focus-ring.component.html',
  styleUrl: './focus-ring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  hostDirectives: [
    {
      directive: AttachableDirective,
      inputs: ['events', 'for', 'target'],
    },
  ],
  host: {
    '[attr.focused]': 'focused() || null',
  },
})
export class FocusRingComponent extends MaterialDesignComponent {
  readonly focusVisible = model(true);
  readonly attachableDirective = inject(AttachableDirective);
  readonly focused = toSignal(
    this.attachableDirective.event$.pipe(
      map((x) => {
        if (x.type === 'focusout') {
          return false;
        }
        return this.focusVisible()
          ? this.attachableDirective
              .targetElement()
              ?.matches(':focus-visible') ?? false
          : true;
      })
    )
  );

  constructor() {
    super();
    this.attachableDirective.events.set(['focusin', 'focusout']);
  }
}
