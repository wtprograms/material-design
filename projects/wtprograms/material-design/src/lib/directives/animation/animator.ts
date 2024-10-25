import { Observable } from 'rxjs';
import {
  AnimationInstruction,
  toKeyframeAnimationOptions,
} from './animation-instruction';

export class Animator {
  readonly state: unknown;
  readonly instructions: AnimationInstruction[];
  private _stopped = false;

  private _abortController = new AbortController();

  constructor(
    stateOrStates: unknown | unknown[],
    ...instructions: AnimationInstruction[]
  ) {
    this.state = Array.isArray(stateOrStates) ? stateOrStates : [stateOrStates];
    this.instructions = instructions;
  }

  animate(stateValue: unknown, element: HTMLElement): Observable<unknown> {
    return new Observable<unknown>((subscriber) => {
      if (this.instructions.length === 0) {
        subscriber.next(stateValue);
        subscriber.complete();
        return;
      }
      if (!this._abortController || this._stopped) {
        this._abortController = new AbortController();
        this._stopped = false;
      }
      const animations: Animation[] = [];
      for (const instruction of this.instructions) {
        if (this.state != stateValue) {
          const isArrayAndSame =
            Array.isArray(this.state) &&
            Array.isArray(stateValue) &&
            this.state.length === stateValue.length &&
            this.state.every((value, index) => value === stateValue[index]);
          if (!isArrayAndSame) {
            continue;
          }
        }
        if (instruction.style) {
          const style =
            typeof instruction.style === 'function'
              ? instruction.style()
              : instruction.style;
          Object.assign(element.style, style);
        }
        if (instruction.keyframes) {
          const keyFrames =
            typeof instruction.keyframes === 'function'
              ? instruction.keyframes()
              : instruction.keyframes;
          instruction.options ??= {};
          instruction.options =
            typeof instruction.options === 'function'
              ? instruction.options()
              : instruction.options;
          instruction.options.duration ??= 'short4';
          instruction.options.easing ??= 'standard';
          const animation = element.animate(
            keyFrames ?? null,
            toKeyframeAnimationOptions(instruction.options)
          );
          this._abortController.signal.addEventListener('abort', () =>
            animation.cancel()
          );
          animations.push(animation);
        }
      }

      Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        animations.map((animation) => animation.finished.catch(() => {}))
      ).then(() => {
        subscriber.next(stateValue);
        subscriber.complete();
      });
    });
  }

  stop() {
    this._abortController?.abort();
    this._stopped = true;
  }
}
