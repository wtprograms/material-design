import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, model, output, PLATFORM_ID, signal, ViewEncapsulation, } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { attach, AttachableDirective, } from '../../directives/attachable.directive';
import { autoUpdate, computePosition, flip, offset, shift, } from '@floating-ui/dom';
import { filter, fromEvent, map, merge, of, Subject, switchMap, takeUntil, tap, timer, } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { animationContext, AnimationContextDirective, } from '../../directives/animation/animation-context.directive';
import { Animator } from '../../directives/animation/animator';
import { AnimationDirective } from '../../directives/animation/animation.directive';
import { openClose } from '../../common/rxjs/open-close';
import { ElevationComponent } from '../elevation/elevation.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/animation/animation-context.directive";
import * as i2 from "../../directives/attachable.directive";
export class PopoverComponent extends MaterialDesignComponent {
    attachableDirective = attach('click', 'pointerdown', 'pointerenter', 'pointerleave', 'contextmenu');
    trigger = model('click');
    flip = model(false);
    shift = model(false);
    offset = model(0);
    delay = model(0);
    placement = model('bottom-start');
    strategy = model('absolute');
    native = model(true);
    open = model(false);
    manualClose = model(false);
    useContainerWidth = model(false);
    containerWidth = computed(() => {
        this.open();
        const useContainerWidth = this.useContainerWidth();
        if (!useContainerWidth) {
            return null;
        }
        const target = this.attachableDirective.targetElement();
        if (!target) {
            return null;
        }
        return `${target.offsetWidth}px`;
    });
    _position = signal({});
    _display = signal('none');
    _opacity = signal(0);
    _document = inject(DOCUMENT);
    _documentClick$ = fromEvent(this._document, 'click').pipe(map((event) => {
        const targetElement = this.attachableDirective.targetElement();
        if (this.state() !== 'opened' || !targetElement) {
            return;
        }
        const path = event.composedPath();
        if (path.includes(this.hostElement) || path.includes(targetElement)) {
            return undefined;
        }
        return false;
    }), filter((x) => x !== undefined));
    _cancelTimer = new Subject();
    _events$ = this.attachableDirective.event$.pipe(switchMap((event) => {
        if (event.type === 'pointerleave' && this.trigger() === 'hover') {
            this._cancelTimer.next();
            return this.manualClose() ? of({}) : of(false);
        }
        if (this.state() !== 'opened') {
            if ((event.type === 'click' && this.trigger() === 'click') ||
                (event.type === 'pointerenter' && this.trigger() === 'hover') ||
                (event.type === 'contextmenu' && this.trigger() === 'contextmenu')) {
                if (event.type === 'contextmenu') {
                    event.preventDefault();
                }
                return timer(this.delay()).pipe(takeUntil(this._cancelTimer), map(() => true));
            }
        }
        return of({});
    }), map((x) => {
        if (this._closing) {
            this._closing = false;
            return;
        }
        return x;
    }), filter((x) => typeof x === 'boolean'));
    _openClose$ = openClose(this.open, 'long2', 'long3');
    state = toSignal(this._openClose$, { initialValue: 'closed' });
    stateChange = output();
    hostStyle = computed(() => ({
        display: this._display(),
        opacity: this._opacity().toString(),
        top: this._position()?.top ?? '',
        left: this._position()?.start ?? '',
    }));
    transformOrigin = computed(() => {
        const placement = this._position()?.placement ?? this.placement();
        const top = [
            'right-start',
            'left-start',
            'bottom',
            'bottom-start',
            'bottom-end',
        ];
        const bottom = [
            'right-end',
            'left-end',
            'top',
            'top-start',
            'top-end',
        ];
        if (top.find((x) => x === placement)) {
            return 'top';
        }
        else if (bottom.find((x) => x === placement)) {
            return 'bottom';
        }
        return '';
    });
    animationTriggers = {
        container: [
            new Animator('opening', {
                keyframes: { height: '100%' },
                options: { duration: 'short4', easing: 'standardDecelerate' },
            }),
            new Animator('closing', {
                keyframes: { height: '0' },
                options: {
                    duration: 'short2',
                    easing: 'standardAccelerate',
                    delay: 'short1',
                },
            }),
        ],
        body: [
            new Animator('opening', {
                keyframes: { opacity: '1' },
                options: {
                    duration: 'short4',
                    easing: 'standardDecelerate',
                    delay: 'short3',
                },
            }),
            new Animator('closing', {
                keyframes: { opacity: '0' },
                options: { duration: 'short2', easing: 'standardAccelerate' },
            }),
        ],
    };
    _platformId = inject(PLATFORM_ID);
    _cancelAutoUpdate;
    _destroyRef = inject(DestroyRef);
    _closing = false;
    constructor() {
        super();
        effect(() => this.stateChange.emit(this.state()));
        animationContext(this.animationTriggers);
        merge(this._documentClick$, this._events$)
            .pipe(takeUntilDestroyed(this._destroyRef), tap((x) => this.open.set(x)))
            .subscribe();
        effect(() => {
            if (this.native()) {
                this.hostElement.popover = 'manual';
            }
            else {
                this.hostElement.popover = '';
            }
        });
        effect(() => {
            const state = this.state();
            if (state === 'opening') {
                if (this.attachableDirective.targetElement() &&
                    isPlatformBrowser(this._platformId)) {
                    this._cancelAutoUpdate = autoUpdate(this.attachableDirective.targetElement(), this.hostElement, this.updatePosition.bind(this));
                }
                this._display.set('inline-flex');
                if (this.native() && isPlatformBrowser(this._platformId)) {
                    this.hostElement.showPopover();
                }
                this._opacity.set(1);
            }
            if (state === 'closed') {
                this._display.set('none');
                this._opacity.set(0);
                if (this.native() && isPlatformBrowser(this._platformId)) {
                    this.hostElement.hidePopover();
                }
            }
        }, {
            allowSignalWrites: true,
        });
        effect(() => (this.hostElement.popover = this.native() ? 'manual' : null));
    }
    ngOnDestroy() {
        this._cancelAutoUpdate?.();
    }
    async updatePosition() {
        const target = this.attachableDirective.targetElement();
        if (!target) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const middleware = [offset(this.offset)];
        if (this.flip()) {
            middleware.push(flip());
        }
        if (this.shift()) {
            middleware.push(shift());
        }
        const result = await computePosition(target, this.hostElement, {
            middleware,
            placement: this.placement(),
            strategy: this.strategy(),
        });
        this._position.set({
            start: `${result.x}px`,
            top: `${result.y}px`,
            placement: result.placement,
        });
        return result;
    }
    onClosePopover() {
        this._closing = true;
        this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: PopoverComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: PopoverComponent, isStandalone: true, selector: "md-popover", inputs: { trigger: { classPropertyName: "trigger", publicName: "trigger", isSignal: true, isRequired: false, transformFunction: null }, flip: { classPropertyName: "flip", publicName: "flip", isSignal: true, isRequired: false, transformFunction: null }, shift: { classPropertyName: "shift", publicName: "shift", isSignal: true, isRequired: false, transformFunction: null }, offset: { classPropertyName: "offset", publicName: "offset", isSignal: true, isRequired: false, transformFunction: null }, delay: { classPropertyName: "delay", publicName: "delay", isSignal: true, isRequired: false, transformFunction: null }, placement: { classPropertyName: "placement", publicName: "placement", isSignal: true, isRequired: false, transformFunction: null }, strategy: { classPropertyName: "strategy", publicName: "strategy", isSignal: true, isRequired: false, transformFunction: null }, native: { classPropertyName: "native", publicName: "native", isSignal: true, isRequired: false, transformFunction: null }, open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, manualClose: { classPropertyName: "manualClose", publicName: "manualClose", isSignal: true, isRequired: false, transformFunction: null }, useContainerWidth: { classPropertyName: "useContainerWidth", publicName: "useContainerWidth", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { trigger: "triggerChange", flip: "flipChange", shift: "shiftChange", offset: "offsetChange", delay: "delayChange", placement: "placementChange", strategy: "strategyChange", native: "nativeChange", open: "openChange", manualClose: "manualCloseChange", useContainerWidth: "useContainerWidthChange", stateChange: "stateChange" }, host: { properties: { "attr.strategy": "strategy()", "style": "hostStyle()", "state": "state()", "style.width": "containerWidth()" } }, usesInheritance: true, hostDirectives: [{ directive: i1.AnimationContextDirective }, { directive: i2.AttachableDirective, inputs: ["target", "target"] }], ngImport: i0, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" part=\"container\" class=\"container\"\n  [style.transformOrigin]=\"transformOrigin()\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n</div>\n<div mdAnimation=\"body\" [mdAnimationState]=\"state()\" part=\"body\" class=\"body\">\n  <slot (close-popover)=\"onClosePopover()\"></slot>\n</div>", styles: [":host{display:none;flex-direction:column;inset:auto;opacity:0;margin:0;background-color:transparent;overflow:visible;border-radius:var(--md-sys-shape-extra-small);border:0;padding:0;z-index:var(--md-sys-z-index-popover);isolation:isolate;color:inherit}:host .container{position:absolute;background-color:var(--md-sys-color-surface-container);inset:0;border-radius:inherit;transform-origin:top;z-index:-1;color:inherit;height:0}:host .body{display:inline-flex;flex-direction:column;opacity:0;overflow-y:auto;color:inherit}:host([strategy=fixed]){position:fixed}:host([strategy=absolute]){position:absolute}\n"], dependencies: [{ kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "directive", type: AnimationDirective, selector: "[mdAnimation]", inputs: ["mdAnimation", "mdAnimationAnimators", "mdAnimationState"], outputs: ["mdAnimationChange", "mdAnimationAnimatorsChange", "mdAnimationStateChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: PopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-popover', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [ElevationComponent, AnimationDirective], hostDirectives: [
                        AnimationContextDirective,
                        {
                            directive: AttachableDirective,
                            inputs: ['target'],
                        },
                    ], host: {
                        '[attr.strategy]': 'strategy()',
                        '[style]': 'hostStyle()',
                        '[state]': 'state()',
                        '[style.width]': 'containerWidth()',
                    }, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" part=\"container\" class=\"container\"\n  [style.transformOrigin]=\"transformOrigin()\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n</div>\n<div mdAnimation=\"body\" [mdAnimationState]=\"state()\" part=\"body\" class=\"body\">\n  <slot (close-popover)=\"onClosePopover()\"></slot>\n</div>", styles: [":host{display:none;flex-direction:column;inset:auto;opacity:0;margin:0;background-color:transparent;overflow:visible;border-radius:var(--md-sys-shape-extra-small);border:0;padding:0;z-index:var(--md-sys-z-index-popover);isolation:isolate;color:inherit}:host .container{position:absolute;background-color:var(--md-sys-color-surface-container);inset:0;border-radius:inherit;transform-origin:top;z-index:-1;color:inherit;height:0}:host .body{display:inline-flex;flex-direction:column;opacity:0;overflow-y:auto;color:inherit}:host([strategy=fixed]){position:fixed}:host([strategy=absolute]){position:absolute}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2NvbXBvbmVudHMvcG9wb3Zlci9wb3BvdmVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9wb3BvdmVyL3BvcG92ZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsUUFBUSxFQUNSLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFFTCxNQUFNLEVBQ04sV0FBVyxFQUNYLE1BQU0sRUFDTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUNMLE1BQU0sRUFDTixtQkFBbUIsR0FDcEIsTUFBTSx1Q0FBdUMsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsVUFBVSxFQUNWLGVBQWUsRUFDZixJQUFJLEVBQ0osTUFBTSxFQUVOLEtBQUssR0FFTixNQUFNLGtCQUFrQixDQUFDO0FBQzFCLE9BQU8sRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULEdBQUcsRUFDSCxLQUFLLEVBRUwsRUFBRSxFQUNGLE9BQU8sRUFDUCxTQUFTLEVBQ1QsU0FBUyxFQUNULEdBQUcsRUFDSCxLQUFLLEdBQ04sTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxnQkFB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Q0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ2pCLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUk7WUFDdEIsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSTtZQUNwQixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO3VHQTNQVSxnQkFBZ0I7MkZBQWhCLGdCQUFnQiwrakVDbkY3QiwyV0FNTSx5cEJEOERNLGtCQUFrQix3TUFBRSxrQkFBa0I7OzJGQWVyQyxnQkFBZ0I7a0JBdEI1QixTQUFTOytCQUNFLFlBQVksY0FHVixJQUFJLG1CQUNDLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLFNBQVMsV0FDakMsQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQyxrQkFDakM7d0JBQ2QseUJBQXlCO3dCQUN6Qjs0QkFDRSxTQUFTLEVBQUUsbUJBQW1COzRCQUM5QixNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7eUJBQ25CO3FCQUNGLFFBQ0s7d0JBQ0osaUJBQWlCLEVBQUUsWUFBWTt3QkFDL0IsU0FBUyxFQUFFLGFBQWE7d0JBQ3hCLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixlQUFlLEVBQUUsa0JBQWtCO3FCQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIGNvbXB1dGVkLFxuICBEZXN0cm95UmVmLFxuICBlZmZlY3QsXG4gIGluamVjdCxcbiAgbW9kZWwsXG4gIE9uRGVzdHJveSxcbiAgb3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgc2lnbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudCB9IGZyb20gJy4uL21hdGVyaWFsLWRlc2lnbi5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgYXR0YWNoLFxuICBBdHRhY2hhYmxlRGlyZWN0aXZlLFxufSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2F0dGFjaGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7XG4gIGF1dG9VcGRhdGUsXG4gIGNvbXB1dGVQb3NpdGlvbixcbiAgZmxpcCxcbiAgb2Zmc2V0LFxuICBQbGFjZW1lbnQsXG4gIHNoaWZ0LFxuICBTdHJhdGVneSxcbn0gZnJvbSAnQGZsb2F0aW5nLXVpL2RvbSc7XG5pbXBvcnQge1xuICBmaWx0ZXIsXG4gIGZyb21FdmVudCxcbiAgbWFwLFxuICBtZXJnZSxcbiAgT2JzZXJ2YWJsZSxcbiAgb2YsXG4gIFN1YmplY3QsXG4gIHN3aXRjaE1hcCxcbiAgdGFrZVVudGlsLFxuICB0YXAsXG4gIHRpbWVyLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7IERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyB0YWtlVW50aWxEZXN0cm95ZWQsIHRvU2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9yeGpzLWludGVyb3AnO1xuaW1wb3J0IHtcbiAgYW5pbWF0aW9uQ29udGV4dCxcbiAgQW5pbWF0aW9uQ29udGV4dERpcmVjdGl2ZSxcbiAgQW5pbWF0aW9uVHJpZ2dlcnMsXG59IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYW5pbWF0aW9uL2FuaW1hdGlvbi1jb250ZXh0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBbmltYXRvciB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYW5pbWF0aW9uL2FuaW1hdG9yJztcbmltcG9ydCB7IEFuaW1hdGlvbkRpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYW5pbWF0aW9uL2FuaW1hdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgb3BlbkNsb3NlLCBPcGVuQ2xvc2VTdGF0ZSB9IGZyb20gJy4uLy4uL2NvbW1vbi9yeGpzL29wZW4tY2xvc2UnO1xuaW1wb3J0IHsgRWxldmF0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi4vZWxldmF0aW9uL2VsZXZhdGlvbi5jb21wb25lbnQnO1xuXG5leHBvcnQgdHlwZSBQb3BvdmVyVHJpZ2dlciA9ICdtYW51YWwnIHwgJ2NsaWNrJyB8ICdob3ZlcicgfCAnY29udGV4dG1lbnUnO1xuXG5pbnRlcmZhY2UgUG9zaXRpb24ge1xuICB0b3A/OiBzdHJpbmc7XG4gIHN0YXJ0Pzogc3RyaW5nO1xuICBwbGFjZW1lbnQ/OiBQbGFjZW1lbnQ7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21kLXBvcG92ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcG9wb3Zlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9wb3BvdmVyLmNvbXBvbmVudC5zY3NzJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbSxcbiAgaW1wb3J0czogW0VsZXZhdGlvbkNvbXBvbmVudCwgQW5pbWF0aW9uRGlyZWN0aXZlXSxcbiAgaG9zdERpcmVjdGl2ZXM6IFtcbiAgICBBbmltYXRpb25Db250ZXh0RGlyZWN0aXZlLFxuICAgIHtcbiAgICAgIGRpcmVjdGl2ZTogQXR0YWNoYWJsZURpcmVjdGl2ZSxcbiAgICAgIGlucHV0czogWyd0YXJnZXQnXSxcbiAgICB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLnN0cmF0ZWd5XSc6ICdzdHJhdGVneSgpJyxcbiAgICAnW3N0eWxlXSc6ICdob3N0U3R5bGUoKScsXG4gICAgJ1tzdGF0ZV0nOiAnc3RhdGUoKScsXG4gICAgJ1tzdHlsZS53aWR0aF0nOiAnY29udGFpbmVyV2lkdGgoKScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIFBvcG92ZXJDb21wb25lbnRcbiAgZXh0ZW5kcyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudFxuICBpbXBsZW1lbnRzIE9uRGVzdHJveVxue1xuICByZWFkb25seSBhdHRhY2hhYmxlRGlyZWN0aXZlID0gYXR0YWNoKFxuICAgICdjbGljaycsXG4gICAgJ3BvaW50ZXJkb3duJyxcbiAgICAncG9pbnRlcmVudGVyJyxcbiAgICAncG9pbnRlcmxlYXZlJyxcbiAgICAnY29udGV4dG1lbnUnXG4gICk7XG4gIHJlYWRvbmx5IHRyaWdnZXIgPSBtb2RlbDxQb3BvdmVyVHJpZ2dlcj4oJ2NsaWNrJyk7XG4gIHJlYWRvbmx5IGZsaXAgPSBtb2RlbChmYWxzZSk7XG4gIHJlYWRvbmx5IHNoaWZ0ID0gbW9kZWwoZmFsc2UpO1xuICByZWFkb25seSBvZmZzZXQgPSBtb2RlbCgwKTtcbiAgcmVhZG9ubHkgZGVsYXkgPSBtb2RlbCgwKTtcbiAgcmVhZG9ubHkgcGxhY2VtZW50ID0gbW9kZWw8UGxhY2VtZW50PignYm90dG9tLXN0YXJ0Jyk7XG4gIHJlYWRvbmx5IHN0cmF0ZWd5ID0gbW9kZWw8U3RyYXRlZ3k+KCdhYnNvbHV0ZScpO1xuICByZWFkb25seSBuYXRpdmUgPSBtb2RlbCh0cnVlKTtcbiAgcmVhZG9ubHkgb3BlbiA9IG1vZGVsKGZhbHNlKTtcbiAgcmVhZG9ubHkgbWFudWFsQ2xvc2UgPSBtb2RlbChmYWxzZSk7XG4gIHJlYWRvbmx5IHVzZUNvbnRhaW5lcldpZHRoID0gbW9kZWwoZmFsc2UpO1xuXG4gIHJlYWRvbmx5IGNvbnRhaW5lcldpZHRoID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIHRoaXMub3BlbigpO1xuICAgIGNvbnN0IHVzZUNvbnRhaW5lcldpZHRoID0gdGhpcy51c2VDb250YWluZXJXaWR0aCgpO1xuICAgIGlmICghdXNlQ29udGFpbmVyV2lkdGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUudGFyZ2V0RWxlbWVudCgpO1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGAke3RhcmdldC5vZmZzZXRXaWR0aH1weGA7XG4gIH0pO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX3Bvc2l0aW9uID0gc2lnbmFsPFBvc2l0aW9uPih7fSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rpc3BsYXkgPSBzaWduYWw8J2lubGluZS1mbGV4JyB8ICdub25lJz4oJ25vbmUnKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3BhY2l0eSA9IHNpZ25hbCgwKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2RvY3VtZW50Q2xpY2skID0gZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKS5waXBlKFxuICAgIG1hcCgoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUudGFyZ2V0RWxlbWVudCgpO1xuICAgICAgaWYgKHRoaXMuc3RhdGUoKSAhPT0gJ29wZW5lZCcgfHwgIXRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcGF0aCA9IGV2ZW50LmNvbXBvc2VkUGF0aCgpO1xuICAgICAgaWYgKHBhdGguaW5jbHVkZXModGhpcy5ob3N0RWxlbWVudCkgfHwgcGF0aC5pbmNsdWRlcyh0YXJnZXRFbGVtZW50KSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pLFxuICAgIGZpbHRlcigoeCkgPT4geCAhPT0gdW5kZWZpbmVkKVxuICApO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NhbmNlbFRpbWVyID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRzJCA9IHRoaXMuYXR0YWNoYWJsZURpcmVjdGl2ZS5ldmVudCQucGlwZShcbiAgICBzd2l0Y2hNYXAoKGV2ZW50KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgdW5rbm93bj4gPT4ge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdwb2ludGVybGVhdmUnICYmIHRoaXMudHJpZ2dlcigpID09PSAnaG92ZXInKSB7XG4gICAgICAgIHRoaXMuX2NhbmNlbFRpbWVyLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFudWFsQ2xvc2UoKSA/IG9mKHt9KSA6IG9mKGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlKCkgIT09ICdvcGVuZWQnKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJyAmJiB0aGlzLnRyaWdnZXIoKSA9PT0gJ2NsaWNrJykgfHxcbiAgICAgICAgICAoZXZlbnQudHlwZSA9PT0gJ3BvaW50ZXJlbnRlcicgJiYgdGhpcy50cmlnZ2VyKCkgPT09ICdob3ZlcicpIHx8XG4gICAgICAgICAgKGV2ZW50LnR5cGUgPT09ICdjb250ZXh0bWVudScgJiYgdGhpcy50cmlnZ2VyKCkgPT09ICdjb250ZXh0bWVudScpXG4gICAgICAgICkge1xuICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnY29udGV4dG1lbnUnKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGltZXIodGhpcy5kZWxheSgpKS5waXBlKFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2NhbmNlbFRpbWVyKSxcbiAgICAgICAgICAgIG1hcCgoKSA9PiB0cnVlKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvZih7fSk7XG4gICAgfSksXG4gICAgbWFwKCh4KSA9PiB7XG4gICAgICBpZiAodGhpcy5fY2xvc2luZykge1xuICAgICAgICB0aGlzLl9jbG9zaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB4O1xuICAgIH0pLFxuICAgIGZpbHRlcigoeCkgPT4gdHlwZW9mIHggPT09ICdib29sZWFuJylcbiAgKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9vcGVuQ2xvc2UkID0gb3BlbkNsb3NlKHRoaXMub3BlbiwgJ2xvbmcyJywgJ2xvbmczJyk7XG4gIHJlYWRvbmx5IHN0YXRlID0gdG9TaWduYWwodGhpcy5fb3BlbkNsb3NlJCwgeyBpbml0aWFsVmFsdWU6ICdjbG9zZWQnIH0pO1xuICByZWFkb25seSBzdGF0ZUNoYW5nZSA9IG91dHB1dDxPcGVuQ2xvc2VTdGF0ZT4oKTtcblxuICByZWFkb25seSBob3N0U3R5bGUgPSBjb21wdXRlZChcbiAgICAoKTogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiA9PiAoe1xuICAgICAgZGlzcGxheTogdGhpcy5fZGlzcGxheSgpLFxuICAgICAgb3BhY2l0eTogdGhpcy5fb3BhY2l0eSgpLnRvU3RyaW5nKCksXG4gICAgICB0b3A6IHRoaXMuX3Bvc2l0aW9uKCk/LnRvcCA/PyAnJyxcbiAgICAgIGxlZnQ6IHRoaXMuX3Bvc2l0aW9uKCk/LnN0YXJ0ID8/ICcnLFxuICAgIH0pXG4gICk7XG5cbiAgcmVhZG9ubHkgdHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuX3Bvc2l0aW9uKCk/LnBsYWNlbWVudCA/PyB0aGlzLnBsYWNlbWVudCgpO1xuICAgIGNvbnN0IHRvcDogUGxhY2VtZW50W10gPSBbXG4gICAgICAncmlnaHQtc3RhcnQnLFxuICAgICAgJ2xlZnQtc3RhcnQnLFxuICAgICAgJ2JvdHRvbScsXG4gICAgICAnYm90dG9tLXN0YXJ0JyxcbiAgICAgICdib3R0b20tZW5kJyxcbiAgICBdO1xuICAgIGNvbnN0IGJvdHRvbTogUGxhY2VtZW50W10gPSBbXG4gICAgICAncmlnaHQtZW5kJyxcbiAgICAgICdsZWZ0LWVuZCcsXG4gICAgICAndG9wJyxcbiAgICAgICd0b3Atc3RhcnQnLFxuICAgICAgJ3RvcC1lbmQnLFxuICAgIF07XG4gICAgaWYgKHRvcC5maW5kKCh4KSA9PiB4ID09PSBwbGFjZW1lbnQpKSB7XG4gICAgICByZXR1cm4gJ3RvcCc7XG4gICAgfSBlbHNlIGlmIChib3R0b20uZmluZCgoeCkgPT4geCA9PT0gcGxhY2VtZW50KSkge1xuICAgICAgcmV0dXJuICdib3R0b20nO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIHJlYWRvbmx5IGFuaW1hdGlvblRyaWdnZXJzOiBBbmltYXRpb25UcmlnZ2VycyA9IHtcbiAgICBjb250YWluZXI6IFtcbiAgICAgIG5ldyBBbmltYXRvcignb3BlbmluZycsIHtcbiAgICAgICAga2V5ZnJhbWVzOiB7IGhlaWdodDogJzEwMCUnIH0sXG4gICAgICAgIG9wdGlvbnM6IHsgZHVyYXRpb246ICdzaG9ydDQnLCBlYXNpbmc6ICdzdGFuZGFyZERlY2VsZXJhdGUnIH0sXG4gICAgICB9KSxcbiAgICAgIG5ldyBBbmltYXRvcignY2xvc2luZycsIHtcbiAgICAgICAga2V5ZnJhbWVzOiB7IGhlaWdodDogJzAnIH0sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBkdXJhdGlvbjogJ3Nob3J0MicsXG4gICAgICAgICAgZWFzaW5nOiAnc3RhbmRhcmRBY2NlbGVyYXRlJyxcbiAgICAgICAgICBkZWxheTogJ3Nob3J0MScsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGJvZHk6IFtcbiAgICAgIG5ldyBBbmltYXRvcignb3BlbmluZycsIHtcbiAgICAgICAga2V5ZnJhbWVzOiB7IG9wYWNpdHk6ICcxJyB9LFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgZHVyYXRpb246ICdzaG9ydDQnLFxuICAgICAgICAgIGVhc2luZzogJ3N0YW5kYXJkRGVjZWxlcmF0ZScsXG4gICAgICAgICAgZGVsYXk6ICdzaG9ydDMnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBuZXcgQW5pbWF0b3IoJ2Nsb3NpbmcnLCB7XG4gICAgICAgIGtleWZyYW1lczogeyBvcGFjaXR5OiAnMCcgfSxcbiAgICAgICAgb3B0aW9uczogeyBkdXJhdGlvbjogJ3Nob3J0MicsIGVhc2luZzogJ3N0YW5kYXJkQWNjZWxlcmF0ZScgfSxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfcGxhdGZvcm1JZCA9IGluamVjdChQTEFURk9STV9JRCk7XG5cbiAgcHJpdmF0ZSBfY2FuY2VsQXV0b1VwZGF0ZT86ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX2Rlc3Ryb3lSZWYgPSBpbmplY3QoRGVzdHJveVJlZik7XG5cbiAgcHJpdmF0ZSBfY2xvc2luZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgZWZmZWN0KCgpID0+IHRoaXMuc3RhdGVDaGFuZ2UuZW1pdCh0aGlzLnN0YXRlKCkpKTtcblxuICAgIGFuaW1hdGlvbkNvbnRleHQodGhpcy5hbmltYXRpb25UcmlnZ2Vycyk7XG4gICAgbWVyZ2UodGhpcy5fZG9jdW1lbnRDbGljayQsIHRoaXMuX2V2ZW50cyQpXG4gICAgICAucGlwZShcbiAgICAgICAgdGFrZVVudGlsRGVzdHJveWVkKHRoaXMuX2Rlc3Ryb3lSZWYpLFxuICAgICAgICB0YXAoKHgpID0+IHRoaXMub3Blbi5zZXQoeCkpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCk7XG4gICAgZWZmZWN0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5hdGl2ZSgpKSB7XG4gICAgICAgIHRoaXMuaG9zdEVsZW1lbnQucG9wb3ZlciA9ICdtYW51YWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ob3N0RWxlbWVudC5wb3BvdmVyID0gJyc7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWZmZWN0KFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUoKTtcbiAgICAgICAgaWYgKHN0YXRlID09PSAnb3BlbmluZycpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUudGFyZ2V0RWxlbWVudCgpICYmXG4gICAgICAgICAgICBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsQXV0b1VwZGF0ZSA9IGF1dG9VcGRhdGUoXG4gICAgICAgICAgICAgIHRoaXMuYXR0YWNoYWJsZURpcmVjdGl2ZS50YXJnZXRFbGVtZW50KCkhLFxuICAgICAgICAgICAgICB0aGlzLmhvc3RFbGVtZW50LFxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uLmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuc2V0KCdpbmxpbmUtZmxleCcpO1xuICAgICAgICAgIGlmICh0aGlzLm5hdGl2ZSgpICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLmhvc3RFbGVtZW50LnNob3dQb3BvdmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX29wYWNpdHkuc2V0KDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5LnNldCgnbm9uZScpO1xuICAgICAgICAgIHRoaXMuX29wYWNpdHkuc2V0KDApO1xuICAgICAgICAgIGlmICh0aGlzLm5hdGl2ZSgpICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLmhvc3RFbGVtZW50LmhpZGVQb3BvdmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBhbGxvd1NpZ25hbFdyaXRlczogdHJ1ZSxcbiAgICAgIH1cbiAgICApO1xuICAgIGVmZmVjdCgoKSA9PiAodGhpcy5ob3N0RWxlbWVudC5wb3BvdmVyID0gdGhpcy5uYXRpdmUoKSA/ICdtYW51YWwnIDogbnVsbCkpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fY2FuY2VsQXV0b1VwZGF0ZT8uKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZVBvc2l0aW9uKCkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuYXR0YWNoYWJsZURpcmVjdGl2ZS50YXJnZXRFbGVtZW50KCk7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBtaWRkbGV3YXJlOiBhbnlbXSA9IFtvZmZzZXQodGhpcy5vZmZzZXQpXTtcbiAgICBpZiAodGhpcy5mbGlwKCkpIHtcbiAgICAgIG1pZGRsZXdhcmUucHVzaChmbGlwKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaGlmdCgpKSB7XG4gICAgICBtaWRkbGV3YXJlLnB1c2goc2hpZnQoKSk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbXB1dGVQb3NpdGlvbih0YXJnZXQsIHRoaXMuaG9zdEVsZW1lbnQsIHtcbiAgICAgIG1pZGRsZXdhcmUsXG4gICAgICBwbGFjZW1lbnQ6IHRoaXMucGxhY2VtZW50KCksXG4gICAgICBzdHJhdGVneTogdGhpcy5zdHJhdGVneSgpLFxuICAgIH0pO1xuICAgIHRoaXMuX3Bvc2l0aW9uLnNldCh7XG4gICAgICBzdGFydDogYCR7cmVzdWx0Lnh9cHhgLFxuICAgICAgdG9wOiBgJHtyZXN1bHQueX1weGAsXG4gICAgICBwbGFjZW1lbnQ6IHJlc3VsdC5wbGFjZW1lbnQsXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG9uQ2xvc2VQb3BvdmVyKCkge1xuICAgIHRoaXMuX2Nsb3NpbmcgPSB0cnVlO1xuICAgIHRoaXMub3Blbi5zZXQoZmFsc2UpO1xuICB9XG59XG4iLCI8ZGl2IG1kQW5pbWF0aW9uPVwiY29udGFpbmVyXCIgW21kQW5pbWF0aW9uU3RhdGVdPVwic3RhdGUoKVwiIHBhcnQ9XCJjb250YWluZXJcIiBjbGFzcz1cImNvbnRhaW5lclwiXG4gIFtzdHlsZS50cmFuc2Zvcm1PcmlnaW5dPVwidHJhbnNmb3JtT3JpZ2luKClcIj5cbiAgPG1kLWVsZXZhdGlvbiBwYXJ0PVwiZWxldmF0aW9uXCIgW2xldmVsXT1cIjJcIiAvPlxuPC9kaXY+XG48ZGl2IG1kQW5pbWF0aW9uPVwiYm9keVwiIFttZEFuaW1hdGlvblN0YXRlXT1cInN0YXRlKClcIiBwYXJ0PVwiYm9keVwiIGNsYXNzPVwiYm9keVwiPlxuICA8c2xvdCAoY2xvc2UtcG9wb3Zlcik9XCJvbkNsb3NlUG9wb3ZlcigpXCI+PC9zbG90PlxuPC9kaXY+Il19