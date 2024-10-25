import { ChangeDetectionStrategy, Component, inject, model, } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AttachableDirective } from '../../directives/attachable.directive';
import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/attachable.directive";
export class FocusRingComponent extends MaterialDesignComponent {
    focusVisible = model(true);
    attachableDirective = inject(AttachableDirective);
    focused = toSignal(this.attachableDirective.event$.pipe(map((x) => {
        if (x.type === 'focusout') {
            return false;
        }
        return this.focusVisible()
            ? this.attachableDirective
                .targetElement()
                ?.matches(':focus-visible') ?? false
            : true;
    })));
    constructor() {
        super();
        this.attachableDirective.events.set(['focusin', 'focusout']);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FocusRingComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: FocusRingComponent, isStandalone: true, selector: "md-focus-ring", inputs: { focusVisible: { classPropertyName: "focusVisible", publicName: "focusVisible", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { focusVisible: "focusVisibleChange" }, host: { properties: { "attr.focused": "focused() || null" } }, usesInheritance: true, hostDirectives: [{ directive: i1.AttachableDirective, inputs: ["events", "events", "for", "for", "target", "target"] }], ngImport: i0, template: "", styles: [":host{display:inline-flex;pointer-events:none;border-radius:inherit;inset:0;position:absolute;opacity:0;outline-width:0;outline-offset:3px;outline-color:var(--md-sys-color-outline-variant);outline-style:solid;transition-property:opacity,outline-width;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([focused=true]){outline-width:3px;opacity:1}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FocusRingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-focus-ring', changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['events', 'for', 'target'],
                        },
                    ], host: {
                        '[attr.focused]': 'focused() || null',
                    }, template: "", styles: [":host{display:inline-flex;pointer-events:none;border-radius:inherit;inset:0;position:absolute;opacity:0;outline-width:0;outline-offset:3px;outline-color:var(--md-sys-color-outline-variant);outline-style:solid;transition-property:opacity,outline-width;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([focused=true]){outline-width:3px;opacity:1}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMtcmluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2NvbXBvbmVudHMvZm9jdXMtcmluZy9mb2N1cy1yaW5nLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9mb2N1cy1yaW5nL2ZvY3VzLXJpbmcuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssR0FDTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7O0FBa0J2RSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsdUJBQXVCO0lBQ3BELFlBQVksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDbEQsT0FBTyxHQUFHLFFBQVEsQ0FDekIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2xDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ1IsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQzFCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN4QixDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQjtpQkFDckIsYUFBYSxFQUFFO2dCQUNoQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEtBQUs7WUFDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUNILENBQ0YsQ0FBQztJQUVGO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7dUdBckJVLGtCQUFrQjsyRkFBbEIsa0JBQWtCLGtlQzNCL0IsRUFBQTs7MkZEMkJhLGtCQUFrQjtrQkFoQjlCLFNBQVM7K0JBQ0UsZUFBZSxtQkFHUix1QkFBdUIsQ0FBQyxNQUFNLGNBQ25DLElBQUksa0JBQ0E7d0JBQ2Q7NEJBQ0UsU0FBUyxFQUFFLG1CQUFtQjs0QkFDOUIsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7eUJBQ3BDO3FCQUNGLFFBQ0s7d0JBQ0osZ0JBQWdCLEVBQUUsbUJBQW1CO3FCQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIGluamVjdCxcbiAgbW9kZWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdG9TaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF0dGFjaGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2F0dGFjaGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IE1hdGVyaWFsRGVzaWduQ29tcG9uZW50IH0gZnJvbSAnLi4vbWF0ZXJpYWwtZGVzaWduLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21kLWZvY3VzLXJpbmcnLFxuICB0ZW1wbGF0ZVVybDogJy4vZm9jdXMtcmluZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9mb2N1cy1yaW5nLmNvbXBvbmVudC5zY3NzJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGhvc3REaXJlY3RpdmVzOiBbXG4gICAge1xuICAgICAgZGlyZWN0aXZlOiBBdHRhY2hhYmxlRGlyZWN0aXZlLFxuICAgICAgaW5wdXRzOiBbJ2V2ZW50cycsICdmb3InLCAndGFyZ2V0J10sXG4gICAgfSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5mb2N1c2VkXSc6ICdmb2N1c2VkKCkgfHwgbnVsbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIEZvY3VzUmluZ0NvbXBvbmVudCBleHRlbmRzIE1hdGVyaWFsRGVzaWduQ29tcG9uZW50IHtcbiAgcmVhZG9ubHkgZm9jdXNWaXNpYmxlID0gbW9kZWwodHJ1ZSk7XG4gIHJlYWRvbmx5IGF0dGFjaGFibGVEaXJlY3RpdmUgPSBpbmplY3QoQXR0YWNoYWJsZURpcmVjdGl2ZSk7XG4gIHJlYWRvbmx5IGZvY3VzZWQgPSB0b1NpZ25hbChcbiAgICB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUuZXZlbnQkLnBpcGUoXG4gICAgICBtYXAoKHgpID0+IHtcbiAgICAgICAgaWYgKHgudHlwZSA9PT0gJ2ZvY3Vzb3V0Jykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mb2N1c1Zpc2libGUoKVxuICAgICAgICAgID8gdGhpcy5hdHRhY2hhYmxlRGlyZWN0aXZlXG4gICAgICAgICAgICAgIC50YXJnZXRFbGVtZW50KClcbiAgICAgICAgICAgICAgPy5tYXRjaGVzKCc6Zm9jdXMtdmlzaWJsZScpID8/IGZhbHNlXG4gICAgICAgICAgOiB0cnVlO1xuICAgICAgfSlcbiAgICApXG4gICk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUuZXZlbnRzLnNldChbJ2ZvY3VzaW4nLCAnZm9jdXNvdXQnXSk7XG4gIH1cbn1cbiIsIiJdfQ==