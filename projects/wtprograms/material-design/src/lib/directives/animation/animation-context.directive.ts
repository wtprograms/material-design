import {
  Directive,
  effect,
  inject,
  isSignal,
  model,
  OnDestroy,
  Signal,
} from '@angular/core';
import { Animator } from './animator';

export type AnimationTriggers = Record<string, Animator[]>;

@Directive({
  selector: '[mdAnimationContext]',
  standalone: true,
})
export class AnimationContextDirective implements OnDestroy {
  readonly animationTriggers = model<AnimationTriggers>({});

  ngOnDestroy(): void {
    this.stop();
  }

  stop() {
    for (const trigger of Object.values(this.animationTriggers())) {
      for (const animator of trigger) {
        animator.stop();
      }
    }
  }
}

export function animationContext(
  triggers: AnimationTriggers | Signal<AnimationTriggers>
) {
  const directive = inject(AnimationContextDirective);
  if (isSignal(triggers)) {
    effect(() => directive.animationTriggers.set(triggers()), {
      allowSignalWrites: true,
    });
  } else {
    directive.animationTriggers.set(triggers);
  }
  return directive;
}
