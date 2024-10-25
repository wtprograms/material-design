import { Directive, effect, ElementRef, inject, isSignal, model, PLATFORM_ID, } from '@angular/core';
import { AnimationContextDirective } from './animation-context.directive';
import { forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
export class AnimationDirective {
    mdAnimation = model();
    mdAnimationAnimators = model([]);
    mdAnimationState = model();
    _context = inject(AnimationContextDirective, { optional: true });
    _hostElement = inject(ElementRef).nativeElement;
    platformId = inject(PLATFORM_ID);
    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            effect(() => {
                const animators = [];
                const trigger = this.mdAnimation();
                if (trigger && this._context) {
                    const triggerAnimators = this._context.animationTriggers();
                    animators.push(...(triggerAnimators[trigger] ?? []));
                }
                animators.push(...this.mdAnimationAnimators());
                const state = this.mdAnimationState();
                const observables = [];
                for (const animator of animators) {
                    const observable = animator.animate(state, this._hostElement);
                    observables.push(observable);
                }
                forkJoin(observables).subscribe();
            });
        }
    }
    ngOnDestroy() {
        this.stop();
    }
    stop() {
        const animators = this.mdAnimationAnimators();
        for (const animator of animators) {
            animator.stop();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: AnimationDirective, isStandalone: true, selector: "[mdAnimation]", inputs: { mdAnimation: { classPropertyName: "mdAnimation", publicName: "mdAnimation", isSignal: true, isRequired: false, transformFunction: null }, mdAnimationAnimators: { classPropertyName: "mdAnimationAnimators", publicName: "mdAnimationAnimators", isSignal: true, isRequired: false, transformFunction: null }, mdAnimationState: { classPropertyName: "mdAnimationState", publicName: "mdAnimationState", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { mdAnimation: "mdAnimationChange", mdAnimationAnimators: "mdAnimationAnimatorsChange", mdAnimationState: "mdAnimationStateChange" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdAnimation]',
                    standalone: true,
                }]
        }], ctorParameters: () => [] });
export function animation(state, animators) {
    const directive = inject(AnimationDirective);
    effect(() => directive.mdAnimationState.set(state()), {
        allowSignalWrites: true,
    });
    if (isSignal(animators)) {
        effect(() => {
            directive.stop();
            directive.mdAnimationAnimators.set(animators());
        }, {
            allowSignalWrites: true,
        });
    }
    else {
        directive.mdAnimationAnimators.set(animators);
    }
    return directive;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvZGlyZWN0aXZlcy9hbmltYXRpb24vYW5pbWF0aW9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBRUwsV0FBVyxHQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRTFFLE9BQU8sRUFBRSxRQUFRLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBTXBELE1BQU0sT0FBTyxrQkFBa0I7SUFDcEIsV0FBVyxHQUFHLEtBQUssRUFBc0IsQ0FBQztJQUMxQyxvQkFBb0IsR0FBRyxLQUFLLENBQWEsRUFBRSxDQUFDLENBQUM7SUFDN0MsZ0JBQWdCLEdBQUcsS0FBSyxFQUFXLENBQUM7SUFFNUIsUUFBUSxHQUFHLE1BQU0sQ0FDaEMseUJBQXlCLEVBQ3pCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUNuQixDQUFDO0lBQ2UsWUFBWSxHQUMzQixNQUFNLENBQTBCLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUUzQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRWxEO1FBQ0UsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUN2QyxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLE1BQU0sU0FBUyxHQUFlLEVBQUUsQ0FBQztnQkFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUMzRCxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxDQUFDO2dCQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDdEMsTUFBTSxXQUFXLEdBQTBCLEVBQUUsQ0FBQztnQkFDOUMsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDakMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUM5RCxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixDQUFDO2dCQUNELFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFJO1FBQ0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDOUMsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNqQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEIsQ0FBQztJQUNILENBQUM7dUdBNUNVLGtCQUFrQjsyRkFBbEIsa0JBQWtCOzsyRkFBbEIsa0JBQWtCO2tCQUo5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixVQUFVLEVBQUUsSUFBSTtpQkFDakI7O0FBZ0RELE1BQU0sVUFBVSxTQUFTLENBQ3ZCLEtBQXNCLEVBQ3RCLFNBQTBDO0lBRTFDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzdDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUU7UUFDcEQsaUJBQWlCLEVBQUUsSUFBSTtLQUN4QixDQUFDLENBQUM7SUFDSCxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FDSixHQUFHLEVBQUU7WUFDSCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsU0FBUyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELENBQUMsRUFDRDtZQUNFLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FDRixDQUFDO0lBQ0osQ0FBQztTQUFNLENBQUM7UUFDTixTQUFTLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBlZmZlY3QsXG4gIEVsZW1lbnRSZWYsXG4gIGluamVjdCxcbiAgaXNTaWduYWwsXG4gIG1vZGVsLFxuICBPbkRlc3Ryb3ksXG4gIFBMQVRGT1JNX0lELFxuICBTaWduYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5pbWF0aW9uQ29udGV4dERpcmVjdGl2ZSB9IGZyb20gJy4vYW5pbWF0aW9uLWNvbnRleHQuZGlyZWN0aXZlJztcbmltcG9ydCB7IEFuaW1hdG9yIH0gZnJvbSAnLi9hbmltYXRvcic7XG5pbXBvcnQgeyBmb3JrSm9pbiwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWRBbmltYXRpb25dJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uRGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcmVhZG9ubHkgbWRBbmltYXRpb24gPSBtb2RlbDxzdHJpbmcgfCB1bmRlZmluZWQ+KCk7XG4gIHJlYWRvbmx5IG1kQW5pbWF0aW9uQW5pbWF0b3JzID0gbW9kZWw8QW5pbWF0b3JbXT4oW10pO1xuICByZWFkb25seSBtZEFuaW1hdGlvblN0YXRlID0gbW9kZWw8dW5rbm93bj4oKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jb250ZXh0ID0gaW5qZWN0PEFuaW1hdGlvbkNvbnRleHREaXJlY3RpdmU+KFxuICAgIEFuaW1hdGlvbkNvbnRleHREaXJlY3RpdmUsXG4gICAgeyBvcHRpb25hbDogdHJ1ZSB9XG4gICk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2hvc3RFbGVtZW50ID1cbiAgICBpbmplY3Q8RWxlbWVudFJlZjxIVE1MRWxlbWVudD4+KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybUlkID0gaW5qZWN0KFBMQVRGT1JNX0lEKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgZWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgYW5pbWF0b3JzOiBBbmltYXRvcltdID0gW107XG4gICAgICAgIGNvbnN0IHRyaWdnZXIgPSB0aGlzLm1kQW5pbWF0aW9uKCk7XG4gICAgICAgIGlmICh0cmlnZ2VyICYmIHRoaXMuX2NvbnRleHQpIHtcbiAgICAgICAgICBjb25zdCB0cmlnZ2VyQW5pbWF0b3JzID0gdGhpcy5fY29udGV4dC5hbmltYXRpb25UcmlnZ2VycygpO1xuICAgICAgICAgIGFuaW1hdG9ycy5wdXNoKC4uLih0cmlnZ2VyQW5pbWF0b3JzW3RyaWdnZXJdID8/IFtdKSk7XG4gICAgICAgIH1cbiAgICAgICAgYW5pbWF0b3JzLnB1c2goLi4udGhpcy5tZEFuaW1hdGlvbkFuaW1hdG9ycygpKTtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLm1kQW5pbWF0aW9uU3RhdGUoKTtcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8dW5rbm93bj5bXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGFuaW1hdG9yIG9mIGFuaW1hdG9ycykge1xuICAgICAgICAgIGNvbnN0IG9ic2VydmFibGUgPSBhbmltYXRvci5hbmltYXRlKHN0YXRlLCB0aGlzLl9ob3N0RWxlbWVudCk7XG4gICAgICAgICAgb2JzZXJ2YWJsZXMucHVzaChvYnNlcnZhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICBmb3JrSm9pbihvYnNlcnZhYmxlcykuc3Vic2NyaWJlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgY29uc3QgYW5pbWF0b3JzID0gdGhpcy5tZEFuaW1hdGlvbkFuaW1hdG9ycygpO1xuICAgIGZvciAoY29uc3QgYW5pbWF0b3Igb2YgYW5pbWF0b3JzKSB7XG4gICAgICBhbmltYXRvci5zdG9wKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRpb24oXG4gIHN0YXRlOiBTaWduYWw8dW5rbm93bj4sXG4gIGFuaW1hdG9yczogQW5pbWF0b3JbXSB8IFNpZ25hbDxBbmltYXRvcltdPlxuKSB7XG4gIGNvbnN0IGRpcmVjdGl2ZSA9IGluamVjdChBbmltYXRpb25EaXJlY3RpdmUpO1xuICBlZmZlY3QoKCkgPT4gZGlyZWN0aXZlLm1kQW5pbWF0aW9uU3RhdGUuc2V0KHN0YXRlKCkpLCB7XG4gICAgYWxsb3dTaWduYWxXcml0ZXM6IHRydWUsXG4gIH0pO1xuICBpZiAoaXNTaWduYWwoYW5pbWF0b3JzKSkge1xuICAgIGVmZmVjdChcbiAgICAgICgpID0+IHtcbiAgICAgICAgZGlyZWN0aXZlLnN0b3AoKTtcbiAgICAgICAgZGlyZWN0aXZlLm1kQW5pbWF0aW9uQW5pbWF0b3JzLnNldChhbmltYXRvcnMoKSk7XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBhbGxvd1NpZ25hbFdyaXRlczogdHJ1ZSxcbiAgICAgIH1cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGRpcmVjdGl2ZS5tZEFuaW1hdGlvbkFuaW1hdG9ycy5zZXQoYW5pbWF0b3JzKTtcbiAgfVxuICByZXR1cm4gZGlyZWN0aXZlO1xufVxuIl19