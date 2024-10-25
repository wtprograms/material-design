import { Directive, HostListener } from '@angular/core';
import { AttachableDirective } from './attachable.directive';
import * as i0 from "@angular/core";
export class ForwardFocusDirective extends AttachableDirective {
    onFocus() {
        this.targetElement()?.focus();
    }
    onBlur() {
        this.targetElement()?.blur();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ForwardFocusDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.9", type: ForwardFocusDirective, isStandalone: true, host: { listeners: { "focus": "onFocus()", "blur": "onBlur()" } }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ForwardFocusDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], propDecorators: { onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onBlur: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yd2FyZC1mb2N1cy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2RpcmVjdGl2ZXMvZm9yd2FyZC1mb2N1cy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBSzdELE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxtQkFBbUI7SUFFNUQsT0FBTztRQUNMLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBR0QsTUFBTTtRQUNKLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMvQixDQUFDO3VHQVRVLHFCQUFxQjsyRkFBckIscUJBQXFCOzsyRkFBckIscUJBQXFCO2tCQUhqQyxTQUFTO21CQUFDO29CQUNULFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs4QkFHQyxPQUFPO3NCQUROLFlBQVk7dUJBQUMsT0FBTztnQkFNckIsTUFBTTtzQkFETCxZQUFZO3VCQUFDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXR0YWNoYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vYXR0YWNoYWJsZS5kaXJlY3RpdmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgRm9yd2FyZEZvY3VzRGlyZWN0aXZlIGV4dGVuZHMgQXR0YWNoYWJsZURpcmVjdGl2ZSB7XG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJylcbiAgb25Gb2N1cygpIHtcbiAgICB0aGlzLnRhcmdldEVsZW1lbnQoKT8uZm9jdXMoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy50YXJnZXRFbGVtZW50KCk/LmJsdXIoKTtcbiAgfVxufVxuIl19