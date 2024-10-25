import { computed, Directive, ElementRef, HostListener, inject, input, PLATFORM_ID, } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';
import { isPlatformServer } from '@angular/common';
import * as i0 from "@angular/core";
export class SlotDirective {
    name = input();
    slot = input();
    _hostElement = inject(ElementRef);
    _platformId = inject(PLATFORM_ID);
    get _assignedNodes() {
        if (isPlatformServer(this._platformId)) {
            return [];
        }
        return (this._hostElement.nativeElement.assignedNodes({ flatten: true }) ?? []);
    }
    assignedNodes$ = new BehaviorSubject(this._assignedNodes);
    nodes = toSignal(this.assignedNodes$, {
        initialValue: this._assignedNodes,
    });
    length = computed(() => this.nodes().length);
    any = computed(() => !!this.length());
    elements = computed(() => this.nodes().filter((node) => node instanceof HTMLElement));
    components = computed(() => this.elements()
        .map((element) => MaterialDesignComponent.get(element))
        .filter((component) => !!component));
    elementsOf(...types) {
        return Array.from(this.filterType(this.elements(), ...types));
    }
    componentsOf(...types) {
        return Array.from(this.filterType(this.components(), ...types));
    }
    onSlotChange() {
        this.assignedNodes$.next(this._assignedNodes);
    }
    *filterType(items, ...types) {
        for (const item of items) {
            for (const type of types) {
                if (item instanceof type) {
                    yield item;
                }
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SlotDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: SlotDirective, isStandalone: true, selector: "slot", inputs: { name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, slot: { classPropertyName: "slot", publicName: "slot", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "slotchange": "onSlotChange()" }, properties: { "attr.name": "name() ?? null", "attr.slot": "slot() ?? null" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SlotDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'slot',
                    standalone: true,
                    host: {
                        '[attr.name]': 'name() ?? null',
                        '[attr.slot]': 'slot() ?? null',
                    },
                }]
        }], propDecorators: { onSlotChange: [{
                type: HostListener,
                args: ['slotchange']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xvdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2RpcmVjdGl2ZXMvc2xvdC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFFBQVEsRUFDUixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUE0Qm5ELE1BQU0sT0FBTyxhQUFhO0lBQ2YsSUFBSSxHQUFHLEtBQUssRUFBUyxDQUFDO0lBQ3RCLElBQUksR0FBRyxLQUFLLEVBQVMsQ0FBQztJQUVkLFlBQVksR0FDM0IsTUFBTSxDQUE4QixVQUFVLENBQUMsQ0FBQztJQUNqQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRW5ELElBQVksY0FBYztRQUN4QixJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELE9BQU8sQ0FDTCxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQ3ZFLENBQUM7SUFDSixDQUFDO0lBRVEsY0FBYyxHQUFHLElBQUksZUFBZSxDQUFTLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNsRSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDN0MsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjO0tBQ2xDLENBQUMsQ0FBQztJQUNNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksWUFBWSxXQUFXLENBQUMsQ0FDM0QsQ0FBQztJQUNPLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQ2xDLElBQUksQ0FBQyxRQUFRLEVBQUU7U0FDWixHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0RCxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDdEMsQ0FBQztJQUVGLFVBQVUsQ0FBd0IsR0FBRyxLQUFnQjtRQUNuRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxZQUFZLENBQW9DLEdBQUcsS0FBZ0I7UUFDakUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU8sQ0FBQyxVQUFVLENBQUksS0FBZ0IsRUFBRSxHQUFHLEtBQWdCO1FBQzFELEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7WUFDekIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxJQUFJLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ3pCLE1BQU0sSUFBSSxDQUFDO2dCQUNiLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7dUdBckRVLGFBQWE7MkZBQWIsYUFBYTs7MkZBQWIsYUFBYTtrQkFUekIsU0FBUzttQkFBQztvQkFDVCw4REFBOEQ7b0JBQzlELFFBQVEsRUFBRSxNQUFNO29CQUNoQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFO3dCQUNKLGFBQWEsRUFBRSxnQkFBZ0I7d0JBQy9CLGFBQWEsRUFBRSxnQkFBZ0I7cUJBQ2hDO2lCQUNGOzhCQTBDQyxZQUFZO3NCQURYLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGNvbXB1dGVkLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgaW5qZWN0LFxuICBpbnB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFR5cGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdG9TaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE1hdGVyaWFsRGVzaWduQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9tYXRlcmlhbC1kZXNpZ24uY29tcG9uZW50JztcbmltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5leHBvcnQgdHlwZSBTbG90cyA9XG4gIHwgJ2xlYWRpbmcnXG4gIHwgJ3RyYWlsaW5nJ1xuICB8ICdpY29uJ1xuICB8ICdzZWxlY3RlZC12YWx1ZSdcbiAgfCAnaGVhZGxpbmUnXG4gIHwgJ3N1cHBvcnRpbmctdGV4dCdcbiAgfCAnYWN0aW9uJ1xuICB8ICdjb3VudGVyJ1xuICB8ICd1bmNoZWNrZWQtaWNvbidcbiAgfCAnY2hlY2tlZC1pY29uJ1xuICB8ICdwcmVmaXgnXG4gIHwgJ3N1ZmZpeCdcbiAgfCAnaXRlbSdcbiAgfCAnbGFiZWwnXG4gIHwgc3RyaW5nO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdzbG90JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5uYW1lXSc6ICduYW1lKCkgPz8gbnVsbCcsXG4gICAgJ1thdHRyLnNsb3RdJzogJ3Nsb3QoKSA/PyBudWxsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgU2xvdERpcmVjdGl2ZSB7XG4gIHJlYWRvbmx5IG5hbWUgPSBpbnB1dDxTbG90cz4oKTtcbiAgcmVhZG9ubHkgc2xvdCA9IGlucHV0PFNsb3RzPigpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2hvc3RFbGVtZW50ID1cbiAgICBpbmplY3Q8RWxlbWVudFJlZjxIVE1MU2xvdEVsZW1lbnQ+PihFbGVtZW50UmVmKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcGxhdGZvcm1JZCA9IGluamVjdChQTEFURk9STV9JRCk7XG5cbiAgcHJpdmF0ZSBnZXQgX2Fzc2lnbmVkTm9kZXMoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5fcGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuYXNzaWduZWROb2Rlcyh7IGZsYXR0ZW46IHRydWUgfSkgPz8gW11cbiAgICApO1xuICB9XG5cbiAgcmVhZG9ubHkgYXNzaWduZWROb2RlcyQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE5vZGVbXT4odGhpcy5fYXNzaWduZWROb2Rlcyk7XG4gIHJlYWRvbmx5IG5vZGVzID0gdG9TaWduYWwodGhpcy5hc3NpZ25lZE5vZGVzJCwge1xuICAgIGluaXRpYWxWYWx1ZTogdGhpcy5fYXNzaWduZWROb2RlcyxcbiAgfSk7XG4gIHJlYWRvbmx5IGxlbmd0aCA9IGNvbXB1dGVkKCgpID0+IHRoaXMubm9kZXMoKS5sZW5ndGgpO1xuICByZWFkb25seSBhbnkgPSBjb21wdXRlZCgoKSA9PiAhIXRoaXMubGVuZ3RoKCkpO1xuICByZWFkb25seSBlbGVtZW50cyA9IGNvbXB1dGVkKCgpID0+XG4gICAgdGhpcy5ub2RlcygpLmZpbHRlcigobm9kZSkgPT4gbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICApO1xuICByZWFkb25seSBjb21wb25lbnRzID0gY29tcHV0ZWQoKCkgPT5cbiAgICB0aGlzLmVsZW1lbnRzKClcbiAgICAgIC5tYXAoKGVsZW1lbnQpID0+IE1hdGVyaWFsRGVzaWduQ29tcG9uZW50LmdldChlbGVtZW50KSlcbiAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCkgPT4gISFjb21wb25lbnQpXG4gICk7XG5cbiAgZWxlbWVudHNPZjxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KC4uLnR5cGVzOiBUeXBlPFQ+W10pIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmZpbHRlclR5cGUodGhpcy5lbGVtZW50cygpLCAuLi50eXBlcykpO1xuICB9XG5cbiAgY29tcG9uZW50c09mPFQgZXh0ZW5kcyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudD4oLi4udHlwZXM6IFR5cGU8VD5bXSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZmlsdGVyVHlwZSh0aGlzLmNvbXBvbmVudHMoKSwgLi4udHlwZXMpKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3Nsb3RjaGFuZ2UnKVxuICBvblNsb3RDaGFuZ2UoKSB7XG4gICAgdGhpcy5hc3NpZ25lZE5vZGVzJC5uZXh0KHRoaXMuX2Fzc2lnbmVkTm9kZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSAqZmlsdGVyVHlwZTxUPihpdGVtczogdW5rbm93bltdLCAuLi50eXBlczogVHlwZTxUPltdKTogSXRlcmFibGU8VD4ge1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgdHlwZSkge1xuICAgICAgICAgIHlpZWxkIGl0ZW07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==