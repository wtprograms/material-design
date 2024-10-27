import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { AttachableDirective } from '../../directives/attachable.directive';
import { MaterialDesignComponent } from '../material-design.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'md-focus-ring',
  templateUrl: './focus-ring.component.html',
  styleUrl: './focus-ring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  hostDirectives: [
    {
      directive: AttachableDirective,
      inputs: ['events', 'for', 'target'],
    },
  ],
})
export class FocusRingComponent extends MaterialDesignComponent {
  readonly focusVisible = model(true);
  readonly attachableDirective = inject(AttachableDirective);
  readonly focused$ = this.attachableDirective.event$.pipe(
    map((x) => {
      if (x.type === 'focusout') {
        return false;
      }
      return this.focusVisible()
        ? this.attachableDirective.targetElement()?.matches(':focus-visible') ??
            false
        : true;
    })
  );

  constructor() {
    super();
    this.attachableDirective.events.set(['focusin', 'focusout']);
    // toSignal throws Writing to signals is not allowed in niche cases. :(
    this.focused$
      .pipe(
        tap((x) => {
          if (x) {
            this.hostElement.setAttribute('focused', 'true');
          } else {
            this.hostElement.removeAttribute('focused');
          }
        })
      )
      .subscribe();
  }
}
