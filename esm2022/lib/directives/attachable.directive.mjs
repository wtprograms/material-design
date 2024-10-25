import { computed, Directive, effect, ElementRef, inject, isSignal, model, } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, Subject, tap } from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';
import * as i0 from "@angular/core";
export class AttachableDirective {
    events = model([]);
    target = model();
    for = model();
    hostElement = inject(ElementRef).nativeElement;
    _forElement = computed(() => {
        const htmlFor = this.for();
        if (!htmlFor) {
            return undefined;
        }
        return this.hostElement.getRootNode().querySelector(`#${htmlFor}`);
    });
    targetElement = computed(() => this._forElement() ?? getElement(this.target()));
    targetElement$ = toObservable(this.targetElement);
    get event$() {
        return this._event$.asObservable();
    }
    _event$ = new Subject();
    event = outputFromObservable(this._event$);
    _subscription;
    constructor() {
        effect(() => {
            this._subscription?.unsubscribe();
            this._subscription = undefined;
            const targetElement = this.targetElement();
            if (!targetElement) {
                return;
            }
            for (const event of this.events()) {
                const observable = fromEvent(targetElement, event).pipe(tap((x) => this._event$.next(x)));
                if (!this._subscription) {
                    this._subscription = observable.subscribe();
                }
                else {
                    this._subscription.add(observable.subscribe());
                }
            }
        });
    }
    ngOnDestroy() {
        this._subscription?.unsubscribe();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AttachableDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: AttachableDirective, isStandalone: true, inputs: { events: { classPropertyName: "events", publicName: "events", isSignal: true, isRequired: false, transformFunction: null }, target: { classPropertyName: "target", publicName: "target", isSignal: true, isRequired: false, transformFunction: null }, for: { classPropertyName: "for", publicName: "for", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { events: "eventsChange", target: "targetChange", for: "forChange", event: "event" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AttachableDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], ctorParameters: () => [] });
function getElement(element) {
    if (!element) {
        return undefined;
    }
    if (element instanceof MaterialDesignComponent) {
        return element.hostElement;
    }
    return element instanceof ElementRef ? element.nativeElement : element;
}
export function attachTarget(type, element) {
    const directive = inject(type);
    if (isSignal(element)) {
        effect(() => directive.target.set(getElement(element())), {
            allowSignalWrites: true,
        });
    }
    else {
        directive.target.set(getElement(element));
    }
    return directive;
}
export function attach(...events) {
    const directive = inject(AttachableDirective);
    directive.events.set(events);
    return directive;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0YWNoYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2RpcmVjdGl2ZXMvYXR0YWNoYWJsZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFFBQVEsRUFDUixTQUFTLEVBQ1QsTUFBTSxFQUNOLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssR0FJTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQWdCLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQzs7QUFXbEYsTUFBTSxPQUFPLG1CQUFtQjtJQUNyQixNQUFNLEdBQUcsS0FBSyxDQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLE1BQU0sR0FBRyxLQUFLLEVBQWMsQ0FBQztJQUM3QixHQUFHLEdBQUcsS0FBSyxFQUFVLENBQUM7SUFFdEIsV0FBVyxHQUNsQixNQUFNLENBQTBCLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUUzQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2IsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQztRQUNELE9BQ0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQzdCLENBQUMsYUFBYSxDQUFjLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVNLGFBQWEsR0FBRyxRQUFRLENBQy9CLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQ3RELENBQUM7SUFDTyxjQUFjLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUUzRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUNnQixPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQVMsQ0FBQztJQUN2QyxLQUFLLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTVDLGFBQWEsQ0FBZ0I7SUFFckM7UUFDRSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztZQUMvQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNuQixPQUFPO1lBQ1QsQ0FBQztZQUNELEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7Z0JBQ2xDLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUNyRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2pDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzlDLENBQUM7cUJBQU0sQ0FBQztvQkFDTixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFDakQsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsQ0FBQztJQUNwQyxDQUFDO3VHQXREVSxtQkFBbUI7MkZBQW5CLG1CQUFtQjs7MkZBQW5CLG1CQUFtQjtrQkFIL0IsU0FBUzttQkFBQztvQkFDVCxVQUFVLEVBQUUsSUFBSTtpQkFDakI7O0FBMERELFNBQVMsVUFBVSxDQUFDLE9BQW1CO0lBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLE9BQU8sWUFBWSx1QkFBdUIsRUFBRSxDQUFDO1FBQy9DLE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUM3QixDQUFDO0lBQ0QsT0FBTyxPQUFPLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDekUsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQzFCLElBQWEsRUFDYixPQUF3QztJQUV4QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRTtZQUN4RCxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztJQUNMLENBQUM7U0FBTSxDQUFDO1FBQ04sU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxNQUFNLFVBQVUsTUFBTSxDQUFDLEdBQUcsTUFBZ0I7SUFDeEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDOUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0IsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGNvbXB1dGVkLFxuICBEaXJlY3RpdmUsXG4gIGVmZmVjdCxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBpc1NpZ25hbCxcbiAgbW9kZWwsXG4gIE9uRGVzdHJveSxcbiAgU2lnbmFsLFxuICBUeXBlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG91dHB1dEZyb21PYnNlcnZhYmxlLCB0b09ic2VydmFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiwgdGFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvbWF0ZXJpYWwtZGVzaWduLmNvbXBvbmVudCc7XG5cbmV4cG9ydCB0eXBlIFRhcmdldFR5cGUgPVxuICB8IEhUTUxFbGVtZW50XG4gIHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD5cbiAgfCB1bmRlZmluZWRcbiAgfCBNYXRlcmlhbERlc2lnbkNvbXBvbmVudDtcblxuQERpcmVjdGl2ZSh7XG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIEF0dGFjaGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICByZWFkb25seSBldmVudHMgPSBtb2RlbDxzdHJpbmdbXT4oW10pO1xuICByZWFkb25seSB0YXJnZXQgPSBtb2RlbDxUYXJnZXRUeXBlPigpO1xuICByZWFkb25seSBmb3IgPSBtb2RlbDxzdHJpbmc+KCk7XG5cbiAgcmVhZG9ubHkgaG9zdEVsZW1lbnQgPVxuICAgIGluamVjdDxFbGVtZW50UmVmPEhUTUxFbGVtZW50Pj4oRWxlbWVudFJlZikubmF0aXZlRWxlbWVudDtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9mb3JFbGVtZW50ID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGh0bWxGb3IgPSB0aGlzLmZvcigpO1xuICAgIGlmICghaHRtbEZvcikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuaG9zdEVsZW1lbnQuZ2V0Um9vdE5vZGUoKSBhcyBEb2N1bWVudCB8IFNoYWRvd1Jvb3RcbiAgICApLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGAjJHtodG1sRm9yfWApO1xuICB9KTtcblxuICByZWFkb25seSB0YXJnZXRFbGVtZW50ID0gY29tcHV0ZWQoXG4gICAgKCkgPT4gdGhpcy5fZm9yRWxlbWVudCgpID8/IGdldEVsZW1lbnQodGhpcy50YXJnZXQoKSlcbiAgKTtcbiAgcmVhZG9ubHkgdGFyZ2V0RWxlbWVudCQgPSB0b09ic2VydmFibGUodGhpcy50YXJnZXRFbGVtZW50KTtcblxuICBnZXQgZXZlbnQkKCkge1xuICAgIHJldHVybiB0aGlzLl9ldmVudCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cbiAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnQkID0gbmV3IFN1YmplY3Q8RXZlbnQ+KCk7XG4gIHJlYWRvbmx5IGV2ZW50ID0gb3V0cHV0RnJvbU9ic2VydmFibGUodGhpcy5fZXZlbnQkKTtcblxuICBwcml2YXRlIF9zdWJzY3JpcHRpb24/OiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZWZmZWN0KCgpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQoKTtcbiAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHRoaXMuZXZlbnRzKCkpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZSA9IGZyb21FdmVudCh0YXJnZXRFbGVtZW50LCBldmVudCkucGlwZShcbiAgICAgICAgICB0YXAoKHgpID0+IHRoaXMuX2V2ZW50JC5uZXh0KHgpKVxuICAgICAgICApO1xuICAgICAgICBpZiAoIXRoaXMuX3N1YnNjcmlwdGlvbikge1xuICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLmFkZChvYnNlcnZhYmxlLnN1YnNjcmliZSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnQoZWxlbWVudDogVGFyZ2V0VHlwZSkge1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTWF0ZXJpYWxEZXNpZ25Db21wb25lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5ob3N0RWxlbWVudDtcbiAgfVxuICByZXR1cm4gZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnRSZWYgPyBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQgOiBlbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXR0YWNoVGFyZ2V0PFQgZXh0ZW5kcyBBdHRhY2hhYmxlRGlyZWN0aXZlPihcbiAgdHlwZTogVHlwZTxUPixcbiAgZWxlbWVudDogVGFyZ2V0VHlwZSB8IFNpZ25hbDxUYXJnZXRUeXBlPlxuKSB7XG4gIGNvbnN0IGRpcmVjdGl2ZSA9IGluamVjdCh0eXBlKTtcbiAgaWYgKGlzU2lnbmFsKGVsZW1lbnQpKSB7XG4gICAgZWZmZWN0KCgpID0+IGRpcmVjdGl2ZS50YXJnZXQuc2V0KGdldEVsZW1lbnQoZWxlbWVudCgpKSksIHtcbiAgICAgIGFsbG93U2lnbmFsV3JpdGVzOiB0cnVlLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGRpcmVjdGl2ZS50YXJnZXQuc2V0KGdldEVsZW1lbnQoZWxlbWVudCkpO1xuICB9XG4gIHJldHVybiBkaXJlY3RpdmU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdHRhY2goLi4uZXZlbnRzOiBzdHJpbmdbXSkge1xuICBjb25zdCBkaXJlY3RpdmUgPSBpbmplY3QoQXR0YWNoYWJsZURpcmVjdGl2ZSk7XG4gIGRpcmVjdGl2ZS5ldmVudHMuc2V0KGV2ZW50cyk7XG4gIHJldHVybiBkaXJlY3RpdmU7XG59XG4iXX0=