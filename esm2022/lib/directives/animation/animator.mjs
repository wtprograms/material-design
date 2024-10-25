import { Observable } from 'rxjs';
import { toKeyframeAnimationOptions, } from './animation-instruction';
export class Animator {
    state;
    instructions;
    _stopped = false;
    _abortController = new AbortController();
    constructor(stateOrStates, ...instructions) {
        this.state = Array.isArray(stateOrStates) ? stateOrStates : [stateOrStates];
        this.instructions = instructions;
    }
    animate(stateValue, element) {
        return new Observable((subscriber) => {
            if (this.instructions.length === 0) {
                subscriber.next(stateValue);
                subscriber.complete();
                return;
            }
            if (!this._abortController || this._stopped) {
                this._abortController = new AbortController();
                this._stopped = false;
            }
            const animations = [];
            for (const instruction of this.instructions) {
                if (this.state != stateValue) {
                    const isArrayAndSame = Array.isArray(this.state) &&
                        Array.isArray(stateValue) &&
                        this.state.length === stateValue.length &&
                        this.state.every((value, index) => value === stateValue[index]);
                    if (!isArrayAndSame) {
                        continue;
                    }
                }
                if (instruction.style) {
                    const style = typeof instruction.style === 'function'
                        ? instruction.style()
                        : instruction.style;
                    Object.assign(element.style, style);
                }
                if (instruction.keyframes) {
                    const keyFrames = typeof instruction.keyframes === 'function'
                        ? instruction.keyframes()
                        : instruction.keyframes;
                    instruction.options ??= {};
                    instruction.options =
                        typeof instruction.options === 'function'
                            ? instruction.options()
                            : instruction.options;
                    instruction.options.duration ??= 'short4';
                    instruction.options.easing ??= 'standard';
                    const animation = element.animate(keyFrames ?? null, toKeyframeAnimationOptions(instruction.options));
                    this._abortController.signal.addEventListener('abort', () => animation.cancel());
                    animations.push(animation);
                }
            }
            Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            animations.map((animation) => animation.finished.catch(() => { }))).then(() => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2RpcmVjdGl2ZXMvYW5pbWF0aW9uL2FuaW1hdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUVMLDBCQUEwQixHQUMzQixNQUFNLHlCQUF5QixDQUFDO0FBRWpDLE1BQU0sT0FBTyxRQUFRO0lBQ1YsS0FBSyxDQUFVO0lBQ2YsWUFBWSxDQUF5QjtJQUN0QyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBRWpCLGdCQUFnQixHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7SUFFakQsWUFDRSxhQUFrQyxFQUNsQyxHQUFHLFlBQW9DO1FBRXZDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLENBQUMsVUFBbUIsRUFBRSxPQUFvQjtRQUMvQyxPQUFPLElBQUksVUFBVSxDQUFVLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDNUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDbkMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDNUIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN0QixPQUFPO1lBQ1QsQ0FBQztZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcs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LEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIEFuaW1hdGlvbkluc3RydWN0aW9uLFxuICB0b0tleWZyYW1lQW5pbWF0aW9uT3B0aW9ucyxcbn0gZnJvbSAnLi9hbmltYXRpb24taW5zdHJ1Y3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgQW5pbWF0b3Ige1xuICByZWFkb25seSBzdGF0ZTogdW5rbm93bjtcbiAgcmVhZG9ubHkgaW5zdHJ1Y3Rpb25zOiBBbmltYXRpb25JbnN0cnVjdGlvbltdO1xuICBwcml2YXRlIF9zdG9wcGVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHN0YXRlT3JTdGF0ZXM6IHVua25vd24gfCB1bmtub3duW10sXG4gICAgLi4uaW5zdHJ1Y3Rpb25zOiBBbmltYXRpb25JbnN0cnVjdGlvbltdXG4gICkge1xuICAgIHRoaXMuc3RhdGUgPSBBcnJheS5pc0FycmF5KHN0YXRlT3JTdGF0ZXMpID8gc3RhdGVPclN0YXRlcyA6IFtzdGF0ZU9yU3RhdGVzXTtcbiAgICB0aGlzLmluc3RydWN0aW9ucyA9IGluc3RydWN0aW9ucztcbiAgfVxuXG4gIGFuaW1hdGUoc3RhdGVWYWx1ZTogdW5rbm93biwgZWxlbWVudDogSFRNTEVsZW1lbnQpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8dW5rbm93bj4oKHN1YnNjcmliZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmluc3RydWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHN0YXRlVmFsdWUpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5fYWJvcnRDb250cm9sbGVyIHx8IHRoaXMuX3N0b3BwZWQpIHtcbiAgICAgICAgdGhpcy5fYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICB0aGlzLl9zdG9wcGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBhbmltYXRpb25zOiBBbmltYXRpb25bXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBpbnN0cnVjdGlvbiBvZiB0aGlzLmluc3RydWN0aW9ucykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPSBzdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgaXNBcnJheUFuZFNhbWUgPVxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh0aGlzLnN0YXRlKSAmJlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShzdGF0ZVZhbHVlKSAmJlxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5sZW5ndGggPT09IHN0YXRlVmFsdWUubGVuZ3RoICYmXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSBzdGF0ZVZhbHVlW2luZGV4XSk7XG4gICAgICAgICAgaWYgKCFpc0FycmF5QW5kU2FtZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0cnVjdGlvbi5zdHlsZSkge1xuICAgICAgICAgIGNvbnN0IHN0eWxlID1cbiAgICAgICAgICAgIHR5cGVvZiBpbnN0cnVjdGlvbi5zdHlsZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICA/IGluc3RydWN0aW9uLnN0eWxlKClcbiAgICAgICAgICAgICAgOiBpbnN0cnVjdGlvbi5zdHlsZTtcbiAgICAgICAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24ua2V5ZnJhbWVzKSB7XG4gICAgICAgICAgY29uc3Qga2V5RnJhbWVzID1cbiAgICAgICAgICAgIHR5cGVvZiBpbnN0cnVjdGlvbi5rZXlmcmFtZXMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgPyBpbnN0cnVjdGlvbi5rZXlmcmFtZXMoKVxuICAgICAgICAgICAgICA6IGluc3RydWN0aW9uLmtleWZyYW1lcztcbiAgICAgICAgICBpbnN0cnVjdGlvbi5vcHRpb25zID8/PSB7fTtcbiAgICAgICAgICBpbnN0cnVjdGlvbi5vcHRpb25zID1cbiAgICAgICAgICAgIHR5cGVvZiBpbnN0cnVjdGlvbi5vcHRpb25zID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgID8gaW5zdHJ1Y3Rpb24ub3B0aW9ucygpXG4gICAgICAgICAgICAgIDogaW5zdHJ1Y3Rpb24ub3B0aW9ucztcbiAgICAgICAgICBpbnN0cnVjdGlvbi5vcHRpb25zLmR1cmF0aW9uID8/PSAnc2hvcnQ0JztcbiAgICAgICAgICBpbnN0cnVjdGlvbi5vcHRpb25zLmVhc2luZyA/Pz0gJ3N0YW5kYXJkJztcbiAgICAgICAgICBjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUoXG4gICAgICAgICAgICBrZXlGcmFtZXMgPz8gbnVsbCxcbiAgICAgICAgICAgIHRvS2V5ZnJhbWVBbmltYXRpb25PcHRpb25zKGluc3RydWN0aW9uLm9wdGlvbnMpXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLl9hYm9ydENvbnRyb2xsZXIuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgKCkgPT5cbiAgICAgICAgICAgIGFuaW1hdGlvbi5jYW5jZWwoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgYW5pbWF0aW9ucy5wdXNoKGFuaW1hdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgUHJvbWlzZS5hbGwoXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbiAgICAgICAgYW5pbWF0aW9ucy5tYXAoKGFuaW1hdGlvbikgPT4gYW5pbWF0aW9uLmZpbmlzaGVkLmNhdGNoKCgpID0+IHt9KSlcbiAgICAgICkudGhlbigoKSA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dChzdGF0ZVZhbHVlKTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX2Fib3J0Q29udHJvbGxlcj8uYWJvcnQoKTtcbiAgICB0aGlzLl9zdG9wcGVkID0gdHJ1ZTtcbiAgfVxufVxuIl19