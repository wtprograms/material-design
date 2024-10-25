import { Directive, effect, inject, isSignal, model, } from '@angular/core';
import * as i0 from "@angular/core";
export class AnimationContextDirective {
    animationTriggers = model({});
    ngOnDestroy() {
        this.stop();
    }
    stop() {
        for (const trigger of Object.values(this.animationTriggers())) {
            for (const animator of trigger) {
                animator.stop();
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationContextDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: AnimationContextDirective, isStandalone: true, selector: "[mdAnimationContext]", inputs: { animationTriggers: { classPropertyName: "animationTriggers", publicName: "animationTriggers", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { animationTriggers: "animationTriggersChange" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationContextDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdAnimationContext]',
                    standalone: true,
                }]
        }] });
export function animationContext(triggers) {
    const directive = inject(AnimationContextDirective);
    if (isSignal(triggers)) {
        effect(() => directive.animationTriggers.set(triggers()), {
            allowSignalWrites: true,
        });
    }
    else {
        directive.animationTriggers.set(triggers);
    }
    return directive;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLWNvbnRleHQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvd3Rwcm9ncmFtcy9tYXRlcmlhbC1kZXNpZ24vc3JjL2xpYi9kaXJlY3RpdmVzL2FuaW1hdGlvbi9hbmltYXRpb24tY29udGV4dC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEdBR04sTUFBTSxlQUFlLENBQUM7O0FBU3ZCLE1BQU0sT0FBTyx5QkFBeUI7SUFDM0IsaUJBQWlCLEdBQUcsS0FBSyxDQUFvQixFQUFFLENBQUMsQ0FBQztJQUUxRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELElBQUk7UUFDRixLQUFLLE1BQU0sT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzlELEtBQUssTUFBTSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQy9CLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7dUdBYlUseUJBQXlCOzJGQUF6Qix5QkFBeUI7OzJGQUF6Qix5QkFBeUI7a0JBSnJDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOztBQWlCRCxNQUFNLFVBQVUsZ0JBQWdCLENBQzlCLFFBQXVEO0lBRXZELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3BELElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDdkIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRTtZQUN4RCxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztJQUNMLENBQUM7U0FBTSxDQUFDO1FBQ04sU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgZWZmZWN0LFxuICBpbmplY3QsXG4gIGlzU2lnbmFsLFxuICBtb2RlbCxcbiAgT25EZXN0cm95LFxuICBTaWduYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5pbWF0b3IgfSBmcm9tICcuL2FuaW1hdG9yJztcblxuZXhwb3J0IHR5cGUgQW5pbWF0aW9uVHJpZ2dlcnMgPSBSZWNvcmQ8c3RyaW5nLCBBbmltYXRvcltdPjtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21kQW5pbWF0aW9uQ29udGV4dF0nLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBBbmltYXRpb25Db250ZXh0RGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcmVhZG9ubHkgYW5pbWF0aW9uVHJpZ2dlcnMgPSBtb2RlbDxBbmltYXRpb25UcmlnZ2Vycz4oe30pO1xuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBmb3IgKGNvbnN0IHRyaWdnZXIgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmFuaW1hdGlvblRyaWdnZXJzKCkpKSB7XG4gICAgICBmb3IgKGNvbnN0IGFuaW1hdG9yIG9mIHRyaWdnZXIpIHtcbiAgICAgICAgYW5pbWF0b3Iuc3RvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYW5pbWF0aW9uQ29udGV4dChcbiAgdHJpZ2dlcnM6IEFuaW1hdGlvblRyaWdnZXJzIHwgU2lnbmFsPEFuaW1hdGlvblRyaWdnZXJzPlxuKSB7XG4gIGNvbnN0IGRpcmVjdGl2ZSA9IGluamVjdChBbmltYXRpb25Db250ZXh0RGlyZWN0aXZlKTtcbiAgaWYgKGlzU2lnbmFsKHRyaWdnZXJzKSkge1xuICAgIGVmZmVjdCgoKSA9PiBkaXJlY3RpdmUuYW5pbWF0aW9uVHJpZ2dlcnMuc2V0KHRyaWdnZXJzKCkpLCB7XG4gICAgICBhbGxvd1NpZ25hbFdyaXRlczogdHJ1ZSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBkaXJlY3RpdmUuYW5pbWF0aW9uVHJpZ2dlcnMuc2V0KHRyaWdnZXJzKTtcbiAgfVxuICByZXR1cm4gZGlyZWN0aXZlO1xufVxuIl19