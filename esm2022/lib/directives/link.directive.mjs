import { Directive, input, inject, ElementRef, computed, HostListener, effect, } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith, map, tap } from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';
import * as i0 from "@angular/core";
export class LinkDirective {
    mdLink = input.required();
    mdLinkActiveClass = input();
    mdLinkExact = input(false);
    mdLinkSelectable = input(true);
    mdLinkOutlet = input();
    _router = inject(Router);
    _activatedRoute = inject(ActivatedRoute);
    href = computed(() => this.mdLinkOutlet() ? undefined : this._router.serializeUrl(this.urlTree()));
    urlTree = computed(() => {
        const link = this.mdLink();
        const commands = typeof link === 'string' || typeof link === 'number'
            ? [link]
            : link;
        return this._router.createUrlTree(commands, {
            relativeTo: this._activatedRoute,
        });
    });
    _element = inject(ElementRef);
    _component = computed(() => MaterialDesignComponent.get(this._element.nativeElement));
    _subscription;
    constructor() {
        effect(() => {
            const component = this._component();
            const href = this.href();
            if (!href) {
                return;
            }
            if (component) {
                component.href?.set(href);
            }
            else {
                this._element.nativeElement.setAttribute('href', href);
            }
        }, {
            allowSignalWrites: true,
        });
        this._router.events
            .pipe(startWith(null), filter(() => this.mdLinkSelectable() || !!this.mdLinkActiveClass()), filter((event) => event instanceof NavigationEnd), map(() => this._router.isActive(this.urlTree(), this.mdLinkExact())), tap((isActive) => {
            if (this._component()) {
                this._component().selected.set(isActive);
            }
            if (isActive && this.mdLinkActiveClass()) {
                this._element.nativeElement.classList.add(this.mdLinkActiveClass());
            }
            else {
                this._element.nativeElement.classList.remove(this.mdLinkActiveClass());
            }
        }))
            .subscribe();
    }
    ngOnDestroy() {
        this._subscription?.unsubscribe();
    }
    onClick(event) {
        event.preventDefault();
        if (this.mdLinkOutlet()) {
            this._router.navigate([
                {
                    outlets: {
                        [this.mdLinkOutlet()]: this.href(),
                    },
                },
            ], {
                relativeTo: this._activatedRoute,
            });
        }
        else {
            this._router.navigate([this.href()], {
                relativeTo: this._activatedRoute,
            });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: LinkDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: LinkDirective, isStandalone: true, selector: "[mdLink]", inputs: { mdLink: { classPropertyName: "mdLink", publicName: "mdLink", isSignal: true, isRequired: true, transformFunction: null }, mdLinkActiveClass: { classPropertyName: "mdLinkActiveClass", publicName: "mdLinkActiveClass", isSignal: true, isRequired: false, transformFunction: null }, mdLinkExact: { classPropertyName: "mdLinkExact", publicName: "mdLinkExact", isSignal: true, isRequired: false, transformFunction: null }, mdLinkSelectable: { classPropertyName: "mdLinkSelectable", publicName: "mdLinkSelectable", isSignal: true, isRequired: false, transformFunction: null }, mdLinkOutlet: { classPropertyName: "mdLinkOutlet", publicName: "mdLinkOutlet", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "click": "onClick($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: LinkDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdLink]',
                    standalone: true,
                }]
        }], ctorParameters: () => [], propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2RpcmVjdGl2ZXMvbGluay5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFDVixRQUFRLEVBQ1IsWUFBWSxFQUNaLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4RSxPQUFPLEVBQWdCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNqRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQzs7QUFNbEYsTUFBTSxPQUFPLGFBQWE7SUFDZixNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBdUIsQ0FBQztJQUMvQyxpQkFBaUIsR0FBRyxLQUFLLEVBQVUsQ0FBQztJQUNwQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLGdCQUFnQixHQUFHLEtBQUssQ0FBZSxJQUFJLENBQUMsQ0FBQztJQUM3QyxZQUFZLEdBQUcsS0FBSyxFQUFVLENBQUM7SUFFdkIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QixlQUFlLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRWpELElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQzVCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxF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O1FBQ3ZCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUNuQjtnQkFDRTtvQkFDRSxPQUFPLEVBQUU7d0JBQ1AsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFO3FCQUNwQztpQkFDRjthQUNGLEVBQ0Q7Z0JBQ0UsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlO2FBQ2pDLENBQ0YsQ0FBQztRQUNKLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtnQkFDbkMsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlO2FBQ2pDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO3VHQW5HVSxhQUFhOzJGQUFiLGFBQWE7OzJGQUFiLGFBQWE7a0JBSnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjt3REFnRkMsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgT25EZXN0cm95LFxuICBpbnB1dCxcbiAgaW5qZWN0LFxuICBFbGVtZW50UmVmLFxuICBjb21wdXRlZCxcbiAgSG9zdExpc3RlbmVyLFxuICBlZmZlY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIE5hdmlnYXRpb25FbmQsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIGZpbHRlciwgc3RhcnRXaXRoLCBtYXAsIHRhcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWF0ZXJpYWxEZXNpZ25Db21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL21hdGVyaWFsLWRlc2lnbi5jb21wb25lbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWRMaW5rXScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIExpbmtEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICByZWFkb25seSBtZExpbmsgPSBpbnB1dC5yZXF1aXJlZDx1bmtub3duIHwgdW5rbm93bltdPigpO1xuICByZWFkb25seSBtZExpbmtBY3RpdmVDbGFzcyA9IGlucHV0PHN0cmluZz4oKTtcbiAgcmVhZG9ubHkgbWRMaW5rRXhhY3QgPSBpbnB1dChmYWxzZSk7XG4gIHJlYWRvbmx5IG1kTGlua1NlbGVjdGFibGUgPSBpbnB1dDxib29sZWFuIHwgJyc+KHRydWUpO1xuICByZWFkb25seSBtZExpbmtPdXRsZXQgPSBpbnB1dDxzdHJpbmc+KCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FjdGl2YXRlZFJvdXRlID0gaW5qZWN0KEFjdGl2YXRlZFJvdXRlKTtcblxuICByZWFkb25seSBocmVmID0gY29tcHV0ZWQoKCkgPT5cbiAgICB0aGlzLm1kTGlua091dGxldCgpID8gdW5kZWZpbmVkIDogdGhpcy5fcm91dGVyLnNlcmlhbGl6ZVVybCh0aGlzLnVybFRyZWUoKSlcbiAgKTtcblxuICByZWFkb25seSB1cmxUcmVlID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGxpbmsgPSB0aGlzLm1kTGluaygpO1xuICAgIGNvbnN0IGNvbW1hbmRzOiB1bmtub3duW10gPVxuICAgICAgdHlwZW9mIGxpbmsgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBsaW5rID09PSAnbnVtYmVyJ1xuICAgICAgICA/IFtsaW5rXVxuICAgICAgICA6IChsaW5rIGFzIHVua25vd25bXSk7XG4gICAgcmV0dXJuIHRoaXMuX3JvdXRlci5jcmVhdGVVcmxUcmVlKGNvbW1hbmRzLCB7XG4gICAgICByZWxhdGl2ZVRvOiB0aGlzLl9hY3RpdmF0ZWRSb3V0ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZWxlbWVudCA9IGluamVjdDxFbGVtZW50UmVmPEhUTUxFbGVtZW50Pj4oRWxlbWVudFJlZik7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbXBvbmVudCA9IGNvbXB1dGVkKCgpID0+XG4gICAgTWF0ZXJpYWxEZXNpZ25Db21wb25lbnQuZ2V0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudClcbiAgKTtcblxuICBwcml2YXRlIF9zdWJzY3JpcHRpb24/OiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZWZmZWN0KFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnQoKTtcbiAgICAgICAgY29uc3QgaHJlZiA9IHRoaXMuaHJlZigpO1xuICAgICAgICBpZiAoIWhyZWYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudC5ocmVmPy5zZXQoaHJlZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBhbGxvd1NpZ25hbFdyaXRlczogdHJ1ZSxcbiAgICAgIH1cbiAgICApO1xuICAgIHRoaXMuX3JvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKFxuICAgICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICAgIGZpbHRlcigoKSA9PiB0aGlzLm1kTGlua1NlbGVjdGFibGUoKSB8fCAhIXRoaXMubWRMaW5rQWN0aXZlQ2xhc3MoKSksXG4gICAgICAgIGZpbHRlcigoZXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCksXG4gICAgICAgIG1hcCgoKSA9PiB0aGlzLl9yb3V0ZXIuaXNBY3RpdmUodGhpcy51cmxUcmVlKCksIHRoaXMubWRMaW5rRXhhY3QoKSkpLFxuICAgICAgICB0YXAoKGlzQWN0aXZlOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NvbXBvbmVudCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQoKSEuc2VsZWN0ZWQuc2V0KGlzQWN0aXZlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzQWN0aXZlICYmIHRoaXMubWRMaW5rQWN0aXZlQ2xhc3MoKSkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAgIHRoaXMubWRMaW5rQWN0aXZlQ2xhc3MoKSFcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgICAgICAgICB0aGlzLm1kTGlua0FjdGl2ZUNsYXNzKCkhXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMubWRMaW5rT3V0bGV0KCkpIHtcbiAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG91dGxldHM6IHtcbiAgICAgICAgICAgICAgW3RoaXMubWRMaW5rT3V0bGV0KCkhXTogdGhpcy5ocmVmKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHtcbiAgICAgICAgICByZWxhdGl2ZVRvOiB0aGlzLl9hY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLmhyZWYoKV0sIHtcbiAgICAgICAgcmVsYXRpdmVUbzogdGhpcy5fYWN0aXZhdGVkUm91dGUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==