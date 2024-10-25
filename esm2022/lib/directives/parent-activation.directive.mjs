import { Directive, HostListener } from '@angular/core';
import { isActivationClick } from '../common/events/is-activation-click';
import { dispatchActivationClick } from '../common/events/dispatch-activation-click';
import { AttachableDirective } from './attachable.directive';
import * as i0 from "@angular/core";
export class ParentActivationDirective extends AttachableDirective {
    click(event) {
        const target = this.targetElement();
        if (!target) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        if (!isActivationClick(event)) {
            return;
        }
        this.hostElement.focus();
        event.preventDefault();
        event.stopImmediatePropagation();
        dispatchActivationClick(target);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ParentActivationDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.9", type: ParentActivationDirective, isStandalone: true, host: { listeners: { "click": "click($event)" } }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ParentActivationDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], propDecorators: { click: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyZW50LWFjdGl2YXRpb24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvd3Rwcm9ncmFtcy9tYXRlcmlhbC1kZXNpZ24vc3JjL2xpYi9kaXJlY3RpdmVzL3BhcmVudC1hY3RpdmF0aW9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNyRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFLN0QsTUFBTSxPQUFPLHlCQUEwQixTQUFRLG1CQUFtQjtJQUVoRSxLQUFLLENBQUMsS0FBaUI7UUFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNaLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUNqQyxPQUFPO1FBQ1QsQ0FBQztRQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzlCLE9BQU87UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN6QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDakMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQzt1R0FoQlUseUJBQXlCOzJGQUF6Qix5QkFBeUI7OzJGQUF6Qix5QkFBeUI7a0JBSHJDLFNBQVM7bUJBQUM7b0JBQ1QsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOzhCQUdDLEtBQUs7c0JBREosWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNBY3RpdmF0aW9uQ2xpY2sgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzL2lzLWFjdGl2YXRpb24tY2xpY2snO1xuaW1wb3J0IHsgZGlzcGF0Y2hBY3RpdmF0aW9uQ2xpY2sgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzL2Rpc3BhdGNoLWFjdGl2YXRpb24tY2xpY2snO1xuaW1wb3J0IHsgQXR0YWNoYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vYXR0YWNoYWJsZS5kaXJlY3RpdmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgUGFyZW50QWN0aXZhdGlvbkRpcmVjdGl2ZSBleHRlbmRzIEF0dGFjaGFibGVEaXJlY3RpdmUge1xuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIGNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXJnZXRFbGVtZW50KCk7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFpc0FjdGl2YXRpb25DbGljayhldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5ob3N0RWxlbWVudC5mb2N1cygpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgZGlzcGF0Y2hBY3RpdmF0aW9uQ2xpY2sodGFyZ2V0KTtcbiAgfVxufVxuIl19