import {
  Directive,
  effect,
  ElementRef,
  inject,
  isSignal,
  model,
  OnDestroy,
  PLATFORM_ID,
  Signal,
} from '@angular/core';
import { AnimationContextDirective } from './animation-context.directive';
import { Animator } from './animator';
import { forkJoin, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[mdAnimation]',
  standalone: true,
})
export class AnimationDirective implements OnDestroy {
  readonly mdAnimation = model<string | undefined>();
  readonly mdAnimationAnimators = model<Animator[]>([]);
  readonly mdAnimationState = model<unknown>();

  private readonly _context = inject<AnimationContextDirective>(
    AnimationContextDirective,
    { optional: true }
  );
  private readonly _hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const animators: Animator[] = [];
        const trigger = this.mdAnimation();
        if (trigger && this._context) {
          const triggerAnimators = this._context.animationTriggers();
          animators.push(...(triggerAnimators[trigger] ?? []));
        }
        animators.push(...this.mdAnimationAnimators());
        const state = this.mdAnimationState();
        const observables: Observable<unknown>[] = [];
        for (const animator of animators) {
          const observable = animator.animate(state, this._hostElement);
          observables.push(observable);
        }
        forkJoin(observables).subscribe();
      });
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  stop() {
    const animators = this.mdAnimationAnimators();
    for (const animator of animators) {
      animator.stop();
    }
  }
}

export function animation(
  state: Signal<unknown>,
  animators: Animator[] | Signal<Animator[]>
) {
  const directive = inject(AnimationDirective);
  effect(() => directive.mdAnimationState.set(state()), {
    allowSignalWrites: true,
  });
  if (isSignal(animators)) {
    effect(
      () => {
        directive.stop();
        directive.mdAnimationAnimators.set(animators());
      },
      {
        allowSignalWrites: true,
      }
    );
  } else {
    directive.mdAnimationAnimators.set(animators);
  }
  return directive;
}
