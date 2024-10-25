import { ChangeDetectionStrategy, Component, inject, model, signal, ViewEncapsulation, } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { AttachableDirective } from '../../directives/attachable.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs';
import { EASING } from '../../common/motion/easing';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/attachable.directive";
export class RippleComponent extends MaterialDesignComponent {
    hoverable = model(true);
    interactive = model(true);
    attachableDirective = inject(AttachableDirective);
    hovering = toSignal(this.attachableDirective.event$.pipe(filter((x) => (this.hoverable() || this.interactive()) &&
        (x.type === 'pointerenter' || x.type === 'pointerleave')), filter((x) => this.shouldReactToEvent(x)), tap((x) => x.type === 'pointerleave' && this.endPressAnimation()), map((x) => x.type === 'pointerenter')));
    activated = signal(false);
    _rippleStartEvent;
    _checkBoundsAfterContextMenu = false;
    _growAnimation;
    _state = 'inactive';
    _pointerUp$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'pointerup'), filter((x) => this.shouldReactToEvent(x)), map(() => {
        if (this._state === 'holding') {
            return 'waiting-for-click';
        }
        if (this._state === 'touch-delay') {
            this.startPressAnimation(this._rippleStartEvent);
            return 'waiting-for-click';
        }
        return undefined;
    }), filter((x) => !!x), tap((x) => (this._state = x)));
    _pointerDown$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'pointerdown'), filter((x) => this.shouldReactToEvent(x) && this.interactive()), tap((x) => (this._rippleStartEvent = x)), filter((x) => {
        if (!this.isTouch(x)) {
            this._state = 'waiting-for-click';
            this.startPressAnimation(x);
            return false;
        }
        return true;
    }), filter((x) => !this._checkBoundsAfterContextMenu || this.inBounds(x)), tap(() => {
        this._checkBoundsAfterContextMenu = false;
        this._state = 'touch-delay';
    }), delay(150), tap((x) => {
        if (this._state === 'touch-delay') {
            this._state = 'holding';
            this.startPressAnimation(x);
        }
    }));
    _click$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'click' && this.interactive()), tap(() => {
        if (this._state === 'waiting-for-click') {
            this.endPressAnimation();
        }
        else if (this._state === 'inactive') {
            this.startPressAnimation();
            this.endPressAnimation();
        }
    }));
    _pointerCancel$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'pointercancel'), tap(() => this.endPressAnimation()));
    _contextMenu$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'contextmenu'), tap(() => {
        this._checkBoundsAfterContextMenu = true;
        this.endPressAnimation();
    }));
    constructor() {
        super();
        this.attachableDirective.events.set([
            'click',
            'contextmenu',
            'pointercancel',
            'pointerdown',
            'pointerenter',
            'pointerleave',
            'pointerup',
        ]);
        this._pointerUp$.subscribe();
        this._pointerDown$.subscribe();
        this._click$.subscribe();
        this._pointerCancel$.subscribe();
        this._contextMenu$.subscribe();
    }
    determineRippleSize() {
        const { height, width } = this.hostElement.getBoundingClientRect();
        const maxDim = Math.max(height, width);
        const softEdgeSize = Math.max(0.35 * maxDim, 75);
        const initialSize = Math.floor(maxDim * 0.2);
        const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
        const maxRadius = hypotenuse + 10;
        const rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
        const rippleSize = `${initialSize}px`;
        return {
            initialSize,
            rippleScale,
            rippleSize,
        };
    }
    getNormalizedPointerEventCoords(pointerEvent) {
        const { scrollX, scrollY } = window;
        const { left, top } = this.hostElement.getBoundingClientRect();
        const documentX = scrollX + left;
        const documentY = scrollY + top;
        const { pageX, pageY } = pointerEvent;
        return { x: pageX - documentX, y: pageY - documentY };
    }
    getTranslationCoordinates(initialSize, positionEvent) {
        const { height, width } = this.hostElement.getBoundingClientRect();
        // end in the center
        const endPoint = {
            x: (width - initialSize) / 2,
            y: (height - initialSize) / 2,
        };
        let startPoint;
        if (positionEvent instanceof PointerEvent) {
            startPoint = this.getNormalizedPointerEventCoords(positionEvent);
        }
        else {
            startPoint = {
                x: width / 2,
                y: height / 2,
            };
        }
        // center around start point
        startPoint = {
            x: startPoint.x - initialSize / 2,
            y: startPoint.y - initialSize / 2,
        };
        return { startPoint, endPoint };
    }
    startPressAnimation(positionEvent) {
        this.activated.set(true);
        this._growAnimation?.cancel();
        const { initialSize, rippleSize, rippleScale } = this.determineRippleSize();
        const { startPoint, endPoint } = this.getTranslationCoordinates(initialSize, positionEvent);
        const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
        const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
        this._growAnimation = this.hostElement.animate({
            top: [0, 0],
            left: [0, 0],
            height: [rippleSize, rippleSize],
            width: [rippleSize, rippleSize],
            transform: [
                `translate(${translateStart}) scale(1)`,
                `translate(${translateEnd}) scale(${rippleScale})`,
            ],
        }, {
            pseudoElement: '::after',
            duration: 450,
            easing: EASING.standard,
            fill: 'forwards',
        });
    }
    async endPressAnimation() {
        this._rippleStartEvent = undefined;
        this._state = 'inactive';
        const animation = this._growAnimation;
        let pressAnimationPlayState = Infinity;
        if (typeof animation?.currentTime === 'number') {
            pressAnimationPlayState = animation.currentTime;
        }
        else if (animation?.currentTime) {
            pressAnimationPlayState = animation.currentTime.to('ms').value;
        }
        if (pressAnimationPlayState >= 225) {
            this.activated.set(false);
            return;
        }
        await new Promise((resolve) => {
            setTimeout(resolve, 225 - pressAnimationPlayState);
        });
        if (this._growAnimation !== animation) {
            // A new press animation was started. The old animation was canceled and
            // should not finish the pressed state.
            return;
        }
        this.activated.set(false);
    }
    shouldReactToEvent(event) {
        if (!event.isPrimary) {
            return false;
        }
        if (this._rippleStartEvent &&
            this._rippleStartEvent.pointerId !== event.pointerId) {
            return false;
        }
        if (event.type === 'pointerenter' || event.type === 'pointerleave') {
            return !this.isTouch(event);
        }
        const isPrimaryButton = event.buttons === 1;
        return this.isTouch(event) || isPrimaryButton;
    }
    inBounds({ x, y }) {
        const { top, left, bottom, right } = this.hostElement.getBoundingClientRect();
        return x >= left && x <= right && y >= top && y <= bottom;
    }
    isTouch({ pointerType }) {
        return pointerType === 'touch';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: RippleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: RippleComponent, isStandalone: true, selector: "md-ripple, [mdRipple]", inputs: { hoverable: { classPropertyName: "hoverable", publicName: "hoverable", isSignal: true, isRequired: false, transformFunction: null }, interactive: { classPropertyName: "interactive", publicName: "interactive", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { hoverable: "hoverableChange", interactive: "interactiveChange" }, host: { properties: { "attr.hovering": "hovering() || null", "attr.activated": "activated() || null" } }, usesInheritance: true, hostDirectives: [{ directive: i1.AttachableDirective, inputs: ["events", "events", "for", "for", "target", "target"] }], ngImport: i0, template: "", styles: [":host{--md-comp-ripple-color: var(--md-sys-color-surface-on);--md-comp-ripple-color-activated: var(--md-comp-ripple-color);--md-comp-ripple-transform-default: unset;--md-comp-ripple-transform-hover: unset;display:inline-flex;margin:auto;pointer-events:none;border-radius:inherit;position:absolute;inset:0;overflow:hidden;-webkit-tap-highlight-color:transparent}:host:before,:host:after{content:\"\";opacity:0;position:absolute;border-radius:inherit}:host:before{background-color:var(--md-comp-ripple-color);inset:0;transform:var(--md-comp-ripple-transform-default);transition-property:opacity,background-color,transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host:after{background:radial-gradient(closest-side,var(--md-comp-ripple-color-activated) max(100% - 70px,65%),transparent 100%);transform-origin:center center;transition:opacity 375ms linear}:host([hovering=true]):before{background-color:var(--md-comp-ripple-color);opacity:var(--md-sys-state-hover);transform:var(--md-comp-ripple-transform-hover)}:host([activated=true]):after{opacity:var(--md-sys-state-active);transition-duration:105ms}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: RippleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-ripple, [mdRipple]', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['events', 'for', 'target'],
                        },
                    ], host: {
                        '[attr.hovering]': 'hovering() || null',
                        '[attr.activated]': 'activated() || null',
                    }, template: "", styles: [":host{--md-comp-ripple-color: var(--md-sys-color-surface-on);--md-comp-ripple-color-activated: var(--md-comp-ripple-color);--md-comp-ripple-transform-default: unset;--md-comp-ripple-transform-hover: unset;display:inline-flex;margin:auto;pointer-events:none;border-radius:inherit;position:absolute;inset:0;overflow:hidden;-webkit-tap-highlight-color:transparent}:host:before,:host:after{content:\"\";opacity:0;position:absolute;border-radius:inherit}:host:before{background-color:var(--md-comp-ripple-color);inset:0;transform:var(--md-comp-ripple-transform-default);transition-property:opacity,background-color,transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host:after{background:radial-gradient(closest-side,var(--md-comp-ripple-color-activated) max(100% - 70px,65%),transparent 100%);transform-origin:center center;transition:opacity 375ms linear}:host([hovering=true]):before{background-color:var(--md-comp-ripple-color);opacity:var(--md-sys-state-hover);transform:var(--md-comp-ripple-transform-hover)}:host([activated=true]):after{opacity:var(--md-sys-state-active);transition-duration:105ms}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9yaXBwbGUvcmlwcGxlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9yaXBwbGUvcmlwcGxlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7OztBQTBCcEQsTUFBTSxPQUFPLGVBQWdCLFNBQVEsdUJBQXVCO0lBQ2pELFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixtQkFBbUIsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNsRCxRQUFRLEdBQUcsUUFBUSxDQUMxQixJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDbEMsTUFBTSxDQUNKLENBQUMsQ0FB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QUUsS0FBSyxFQUFFLEdBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMzQyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUM7SUFDNUQsQ0FBQztJQUVPLE9BQU8sQ0FBQyxFQUFFLFdBQVcsRUFBZ0I7UUFDM0MsT0FBTyxXQUFXLEtBQUssT0FBTyxDQUFDO0lBQ2pDLENBQUM7dUdBblFVLGVBQWU7MkZBQWYsZUFBZSxrckJDdEM1QixFQUFBOzsyRkRzQ2EsZUFBZTtrQkFsQjNCLFNBQVM7K0JBQ0UsdUJBQXVCLG1CQUdoQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxTQUFTLGNBQzlCLElBQUksa0JBQ0E7d0JBQ2Q7NEJBQ0UsU0FBUyxFQUFFLG1CQUFtQjs0QkFDOUIsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7eUJBQ3BDO3FCQUNGLFFBQ0s7d0JBQ0osaUJBQWlCLEVBQUUsb0JBQW9CO3dCQUN2QyxrQkFBa0IsRUFBRSxxQkFBcUI7cUJBQzFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgaW5qZWN0LFxuICBtb2RlbCxcbiAgc2lnbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudCB9IGZyb20gJy4uL21hdGVyaWFsLWRlc2lnbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgQXR0YWNoYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYXR0YWNoYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgdG9TaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5pbXBvcnQgeyBkZWxheSwgZmlsdGVyLCBtYXAsIHRhcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRUFTSU5HIH0gZnJvbSAnLi4vLi4vY29tbW9uL21vdGlvbi9lYXNpbmcnO1xuXG50eXBlIEFjdGl2YXRpb25TdGF0ZSA9XG4gIHwgJ2luYWN0aXZlJ1xuICB8ICd0b3VjaC1kZWxheSdcbiAgfCAnaG9sZGluZydcbiAgfCAnd2FpdGluZy1mb3ItY2xpY2snO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtZC1yaXBwbGUsIFttZFJpcHBsZV0nLFxuICB0ZW1wbGF0ZVVybDogJy4vcmlwcGxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL3JpcHBsZS5jb21wb25lbnQuc2NzcycsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb20sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGhvc3REaXJlY3RpdmVzOiBbXG4gICAge1xuICAgICAgZGlyZWN0aXZlOiBBdHRhY2hhYmxlRGlyZWN0aXZlLFxuICAgICAgaW5wdXRzOiBbJ2V2ZW50cycsICdmb3InLCAndGFyZ2V0J10sXG4gICAgfSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5ob3ZlcmluZ10nOiAnaG92ZXJpbmcoKSB8fCBudWxsJyxcbiAgICAnW2F0dHIuYWN0aXZhdGVkXSc6ICdhY3RpdmF0ZWQoKSB8fCBudWxsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgUmlwcGxlQ29tcG9uZW50IGV4dGVuZHMgTWF0ZXJpYWxEZXNpZ25Db21wb25lbnQge1xuICByZWFkb25seSBob3ZlcmFibGUgPSBtb2RlbCh0cnVlKTtcbiAgcmVhZG9ubHkgaW50ZXJhY3RpdmUgPSBtb2RlbCh0cnVlKTtcbiAgcmVhZG9ubHkgYXR0YWNoYWJsZURpcmVjdGl2ZSA9IGluamVjdChBdHRhY2hhYmxlRGlyZWN0aXZlKTtcbiAgcmVhZG9ubHkgaG92ZXJpbmcgPSB0b1NpZ25hbChcbiAgICB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUuZXZlbnQkLnBpcGUoXG4gICAgICBmaWx0ZXIoXG4gICAgICAgICh4KTogeCBpcyBQb2ludGVyRXZlbnQgPT5cbiAgICAgICAgICAodGhpcy5ob3ZlcmFibGUoKSB8fCB0aGlzLmludGVyYWN0aXZlKCkpICYmXG4gICAgICAgICAgKHgudHlwZSA9PT0gJ3BvaW50ZXJlbnRlcicgfHwgeC50eXBlID09PSAncG9pbnRlcmxlYXZlJylcbiAgICAgICksXG4gICAgICBmaWx0ZXIoKHgpID0+IHRoaXMuc2hvdWxkUmVhY3RUb0V2ZW50KHgpKSxcbiAgICAgIHRhcCgoeCkgPT4geC50eXBlID09PSAncG9pbnRlcmxlYXZlJyAmJiB0aGlzLmVuZFByZXNzQW5pbWF0aW9uKCkpLFxuICAgICAgbWFwKCh4KSA9PiB4LnR5cGUgPT09ICdwb2ludGVyZW50ZXInKVxuICAgIClcbiAgKTtcbiAgcmVhZG9ubHkgYWN0aXZhdGVkID0gc2lnbmFsKGZhbHNlKTtcblxuICBwcml2YXRlIF9yaXBwbGVTdGFydEV2ZW50PzogUG9pbnRlckV2ZW50O1xuICBwcml2YXRlIF9jaGVja0JvdW5kc0FmdGVyQ29udGV4dE1lbnUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZ3Jvd0FuaW1hdGlvbj86IEFuaW1hdGlvbjtcblxuICBwcml2YXRlIF9zdGF0ZTogQWN0aXZhdGlvblN0YXRlID0gJ2luYWN0aXZlJztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9wb2ludGVyVXAkID0gdGhpcy5hdHRhY2hhYmxlRGlyZWN0aXZlLmV2ZW50JC5waXBlKFxuICAgIGZpbHRlcigoeCk6IHggaXMgUG9pbnRlckV2ZW50ID0+IHgudHlwZSA9PT0gJ3BvaW50ZXJ1cCcpLFxuICAgIGZpbHRlcigoeCkgPT4gdGhpcy5zaG91bGRSZWFjdFRvRXZlbnQoeCkpLFxuICAgIG1hcCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fc3RhdGUgPT09ICdob2xkaW5nJykge1xuICAgICAgICByZXR1cm4gJ3dhaXRpbmctZm9yLWNsaWNrJztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gJ3RvdWNoLWRlbGF5Jykge1xuICAgICAgICB0aGlzLnN0YXJ0UHJlc3NBbmltYXRpb24odGhpcy5fcmlwcGxlU3RhcnRFdmVudCk7XG4gICAgICAgIHJldHVybiAnd2FpdGluZy1mb3ItY2xpY2snO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KSxcbiAgICBmaWx0ZXIoKHgpID0+ICEheCksXG4gICAgdGFwKCh4KSA9PiAodGhpcy5fc3RhdGUgPSB4KSlcbiAgKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9wb2ludGVyRG93biQgPSB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUuZXZlbnQkLnBpcGUoXG4gICAgZmlsdGVyKCh4KTogeCBpcyBQb2ludGVyRXZlbnQgPT4geC50eXBlID09PSAncG9pbnRlcmRvd24nKSxcbiAgICBmaWx0ZXIoKHgpID0+IHRoaXMuc2hvdWxkUmVhY3RUb0V2ZW50KHgpICYmIHRoaXMuaW50ZXJhY3RpdmUoKSksXG4gICAgdGFwKCh4KSA9PiAodGhpcy5fcmlwcGxlU3RhcnRFdmVudCA9IHgpKSxcbiAgICBmaWx0ZXIoKHgpID0+IHtcbiAgICAgIGlmICghdGhpcy5pc1RvdWNoKHgpKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gJ3dhaXRpbmctZm9yLWNsaWNrJztcbiAgICAgICAgdGhpcy5zdGFydFByZXNzQW5pbWF0aW9uKHgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KSxcbiAgICBmaWx0ZXIoKHgpID0+ICF0aGlzLl9jaGVja0JvdW5kc0FmdGVyQ29udGV4dE1lbnUgfHwgdGhpcy5pbkJvdW5kcyh4KSksXG4gICAgdGFwKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoZWNrQm91bmRzQWZ0ZXJDb250ZXh0TWVudSA9IGZhbHNlO1xuICAgICAgdGhpcy5fc3RhdGUgPSAndG91Y2gtZGVsYXknO1xuICAgIH0pLFxuICAgIGRlbGF5KDE1MCksXG4gICAgdGFwKCh4KSA9PiB7XG4gICAgICBpZiAodGhpcy5fc3RhdGUgPT09ICd0b3VjaC1kZWxheScpIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSAnaG9sZGluZyc7XG4gICAgICAgIHRoaXMuc3RhcnRQcmVzc0FuaW1hdGlvbih4KTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NsaWNrJCA9IHRoaXMuYXR0YWNoYWJsZURpcmVjdGl2ZS5ldmVudCQucGlwZShcbiAgICBmaWx0ZXIoKHgpID0+IHgudHlwZSA9PT0gJ2NsaWNrJyAmJiB0aGlzLmludGVyYWN0aXZlKCkpLFxuICAgIHRhcCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fc3RhdGUgPT09ICd3YWl0aW5nLWZvci1jbGljaycpIHtcbiAgICAgICAgdGhpcy5lbmRQcmVzc0FuaW1hdGlvbigpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gJ2luYWN0aXZlJykge1xuICAgICAgICB0aGlzLnN0YXJ0UHJlc3NBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5lbmRQcmVzc0FuaW1hdGlvbigpO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfcG9pbnRlckNhbmNlbCQgPSB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUuZXZlbnQkLnBpcGUoXG4gICAgZmlsdGVyKCh4KSA9PiB4LnR5cGUgPT09ICdwb2ludGVyY2FuY2VsJyksXG4gICAgdGFwKCgpID0+IHRoaXMuZW5kUHJlc3NBbmltYXRpb24oKSlcbiAgKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jb250ZXh0TWVudSQgPSB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUuZXZlbnQkLnBpcGUoXG4gICAgZmlsdGVyKCh4KSA9PiB4LnR5cGUgPT09ICdjb250ZXh0bWVudScpLFxuICAgIHRhcCgoKSA9PiB7XG4gICAgICB0aGlzLl9jaGVja0JvdW5kc0FmdGVyQ29udGV4dE1lbnUgPSB0cnVlO1xuICAgICAgdGhpcy5lbmRQcmVzc0FuaW1hdGlvbigpO1xuICAgIH0pXG4gICk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmF0dGFjaGFibGVEaXJlY3RpdmUuZXZlbnRzLnNldChbXG4gICAgICAnY2xpY2snLFxuICAgICAgJ2NvbnRleHRtZW51JyxcbiAgICAgICdwb2ludGVyY2FuY2VsJyxcbiAgICAgICdwb2ludGVyZG93bicsXG4gICAgICAncG9pbnRlcmVudGVyJyxcbiAgICAgICdwb2ludGVybGVhdmUnLFxuICAgICAgJ3BvaW50ZXJ1cCcsXG4gICAgXSk7XG4gICAgdGhpcy5fcG9pbnRlclVwJC5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9wb2ludGVyRG93biQuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fY2xpY2skLnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3BvaW50ZXJDYW5jZWwkLnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2NvbnRleHRNZW51JC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGV0ZXJtaW5lUmlwcGxlU2l6ZSgpIHtcbiAgICBjb25zdCB7IGhlaWdodCwgd2lkdGggfSA9IHRoaXMuaG9zdEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbWF4RGltID0gTWF0aC5tYXgoaGVpZ2h0LCB3aWR0aCk7XG4gICAgY29uc3Qgc29mdEVkZ2VTaXplID0gTWF0aC5tYXgoMC4zNSAqIG1heERpbSwgNzUpO1xuXG4gICAgY29uc3QgaW5pdGlhbFNpemUgPSBNYXRoLmZsb29yKG1heERpbSAqIDAuMik7XG4gICAgY29uc3QgaHlwb3RlbnVzZSA9IE1hdGguc3FydCh3aWR0aCAqKiAyICsgaGVpZ2h0ICoqIDIpO1xuICAgIGNvbnN0IG1heFJhZGl1cyA9IGh5cG90ZW51c2UgKyAxMDtcblxuICAgIGNvbnN0IHJpcHBsZVNjYWxlID0gYCR7KG1heFJhZGl1cyArIHNvZnRFZGdlU2l6ZSkgLyBpbml0aWFsU2l6ZX1gO1xuICAgIGNvbnN0IHJpcHBsZVNpemUgPSBgJHtpbml0aWFsU2l6ZX1weGA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW5pdGlhbFNpemUsXG4gICAgICByaXBwbGVTY2FsZSxcbiAgICAgIHJpcHBsZVNpemUsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Tm9ybWFsaXplZFBvaW50ZXJFdmVudENvb3Jkcyhwb2ludGVyRXZlbnQ6IFBvaW50ZXJFdmVudCk6IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICB9IHtcbiAgICBjb25zdCB7IHNjcm9sbFgsIHNjcm9sbFkgfSA9IHdpbmRvdztcbiAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gdGhpcy5ob3N0RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkb2N1bWVudFggPSBzY3JvbGxYICsgbGVmdDtcbiAgICBjb25zdCBkb2N1bWVudFkgPSBzY3JvbGxZICsgdG9wO1xuICAgIGNvbnN0IHsgcGFnZVgsIHBhZ2VZIH0gPSBwb2ludGVyRXZlbnQ7XG4gICAgcmV0dXJuIHsgeDogcGFnZVggLSBkb2N1bWVudFgsIHk6IHBhZ2VZIC0gZG9jdW1lbnRZIH07XG4gIH1cblxuICBwcml2YXRlIGdldFRyYW5zbGF0aW9uQ29vcmRpbmF0ZXMoXG4gICAgaW5pdGlhbFNpemU6IG51bWJlcixcbiAgICBwb3NpdGlvbkV2ZW50PzogRXZlbnRcbiAgKSB7XG4gICAgY29uc3QgeyBoZWlnaHQsIHdpZHRoIH0gPSB0aGlzLmhvc3RFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIC8vIGVuZCBpbiB0aGUgY2VudGVyXG4gICAgY29uc3QgZW5kUG9pbnQgPSB7XG4gICAgICB4OiAod2lkdGggLSBpbml0aWFsU2l6ZSkgLyAyLFxuICAgICAgeTogKGhlaWdodCAtIGluaXRpYWxTaXplKSAvIDIsXG4gICAgfTtcblxuICAgIGxldCBzdGFydFBvaW50O1xuICAgIGlmIChwb3NpdGlvbkV2ZW50IGluc3RhbmNlb2YgUG9pbnRlckV2ZW50KSB7XG4gICAgICBzdGFydFBvaW50ID0gdGhpcy5nZXROb3JtYWxpemVkUG9pbnRlckV2ZW50Q29vcmRzKHBvc2l0aW9uRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydFBvaW50ID0ge1xuICAgICAgICB4OiB3aWR0aCAvIDIsXG4gICAgICAgIHk6IGhlaWdodCAvIDIsXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIGNlbnRlciBhcm91bmQgc3RhcnQgcG9pbnRcbiAgICBzdGFydFBvaW50ID0ge1xuICAgICAgeDogc3RhcnRQb2ludC54IC0gaW5pdGlhbFNpemUgLyAyLFxuICAgICAgeTogc3RhcnRQb2ludC55IC0gaW5pdGlhbFNpemUgLyAyLFxuICAgIH07XG5cbiAgICByZXR1cm4geyBzdGFydFBvaW50LCBlbmRQb2ludCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFByZXNzQW5pbWF0aW9uKHBvc2l0aW9uRXZlbnQ/OiBFdmVudCkge1xuICAgIHRoaXMuYWN0aXZhdGVkLnNldCh0cnVlKTtcbiAgICB0aGlzLl9ncm93QW5pbWF0aW9uPy5jYW5jZWwoKTtcbiAgICBjb25zdCB7IGluaXRpYWxTaXplLCByaXBwbGVTaXplLCByaXBwbGVTY2FsZSB9ID0gdGhpcy5kZXRlcm1pbmVSaXBwbGVTaXplKCk7XG4gICAgY29uc3QgeyBzdGFydFBvaW50LCBlbmRQb2ludCB9ID0gdGhpcy5nZXRUcmFuc2xhdGlvbkNvb3JkaW5hdGVzKFxuICAgICAgaW5pdGlhbFNpemUsXG4gICAgICBwb3NpdGlvbkV2ZW50XG4gICAgKTtcbiAgICBjb25zdCB0cmFuc2xhdGVTdGFydCA9IGAke3N0YXJ0UG9pbnQueH1weCwgJHtzdGFydFBvaW50Lnl9cHhgO1xuICAgIGNvbnN0IHRyYW5zbGF0ZUVuZCA9IGAke2VuZFBvaW50Lnh9cHgsICR7ZW5kUG9pbnQueX1weGA7XG5cbiAgICB0aGlzLl9ncm93QW5pbWF0aW9uID0gdGhpcy5ob3N0RWxlbWVudC5hbmltYXRlKFxuICAgICAge1xuICAgICAgICB0b3A6IFswLCAwXSxcbiAgICAgICAgbGVmdDogWzAsIDBdLFxuICAgICAgICBoZWlnaHQ6IFtyaXBwbGVTaXplLCByaXBwbGVTaXplXSxcbiAgICAgICAgd2lkdGg6IFtyaXBwbGVTaXplLCByaXBwbGVTaXplXSxcbiAgICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgICAgYHRyYW5zbGF0ZSgke3RyYW5zbGF0ZVN0YXJ0fSkgc2NhbGUoMSlgLFxuICAgICAgICAgIGB0cmFuc2xhdGUoJHt0cmFuc2xhdGVFbmR9KSBzY2FsZSgke3JpcHBsZVNjYWxlfSlgLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcHNldWRvRWxlbWVudDogJzo6YWZ0ZXInLFxuICAgICAgICBkdXJhdGlvbjogNDUwLFxuICAgICAgICBlYXNpbmc6IEVBU0lORy5zdGFuZGFyZCxcbiAgICAgICAgZmlsbDogJ2ZvcndhcmRzJyxcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBlbmRQcmVzc0FuaW1hdGlvbigpIHtcbiAgICB0aGlzLl9yaXBwbGVTdGFydEV2ZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3N0YXRlID0gJ2luYWN0aXZlJztcbiAgICBjb25zdCBhbmltYXRpb24gPSB0aGlzLl9ncm93QW5pbWF0aW9uO1xuICAgIGxldCBwcmVzc0FuaW1hdGlvblBsYXlTdGF0ZSA9IEluZmluaXR5O1xuICAgIGlmICh0eXBlb2YgYW5pbWF0aW9uPy5jdXJyZW50VGltZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByZXNzQW5pbWF0aW9uUGxheVN0YXRlID0gYW5pbWF0aW9uLmN1cnJlbnRUaW1lO1xuICAgIH0gZWxzZSBpZiAoYW5pbWF0aW9uPy5jdXJyZW50VGltZSkge1xuICAgICAgcHJlc3NBbmltYXRpb25QbGF5U3RhdGUgPSBhbmltYXRpb24uY3VycmVudFRpbWUudG8oJ21zJykudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKHByZXNzQW5pbWF0aW9uUGxheVN0YXRlID49IDIyNSkge1xuICAgICAgdGhpcy5hY3RpdmF0ZWQuc2V0KGZhbHNlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAyMjUgLSBwcmVzc0FuaW1hdGlvblBsYXlTdGF0ZSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fZ3Jvd0FuaW1hdGlvbiAhPT0gYW5pbWF0aW9uKSB7XG4gICAgICAvLyBBIG5ldyBwcmVzcyBhbmltYXRpb24gd2FzIHN0YXJ0ZWQuIFRoZSBvbGQgYW5pbWF0aW9uIHdhcyBjYW5jZWxlZCBhbmRcbiAgICAgIC8vIHNob3VsZCBub3QgZmluaXNoIHRoZSBwcmVzc2VkIHN0YXRlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZhdGVkLnNldChmYWxzZSk7XG4gIH1cblxuICBwcml2YXRlIHNob3VsZFJlYWN0VG9FdmVudChldmVudDogUG9pbnRlckV2ZW50KSB7XG4gICAgaWYgKCFldmVudC5pc1ByaW1hcnkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9yaXBwbGVTdGFydEV2ZW50ICYmXG4gICAgICB0aGlzLl9yaXBwbGVTdGFydEV2ZW50LnBvaW50ZXJJZCAhPT0gZXZlbnQucG9pbnRlcklkXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdwb2ludGVyZW50ZXInIHx8IGV2ZW50LnR5cGUgPT09ICdwb2ludGVybGVhdmUnKSB7XG4gICAgICByZXR1cm4gIXRoaXMuaXNUb3VjaChldmVudCk7XG4gICAgfVxuXG4gICAgY29uc3QgaXNQcmltYXJ5QnV0dG9uID0gZXZlbnQuYnV0dG9ucyA9PT0gMTtcbiAgICByZXR1cm4gdGhpcy5pc1RvdWNoKGV2ZW50KSB8fCBpc1ByaW1hcnlCdXR0b247XG4gIH1cblxuICBwcml2YXRlIGluQm91bmRzKHsgeCwgeSB9OiBQb2ludGVyRXZlbnQpIHtcbiAgICBjb25zdCB7IHRvcCwgbGVmdCwgYm90dG9tLCByaWdodCB9ID1cbiAgICAgIHRoaXMuaG9zdEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHggPj0gbGVmdCAmJiB4IDw9IHJpZ2h0ICYmIHkgPj0gdG9wICYmIHkgPD0gYm90dG9tO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1RvdWNoKHsgcG9pbnRlclR5cGUgfTogUG9pbnRlckV2ZW50KSB7XG4gICAgcmV0dXJuIHBvaW50ZXJUeXBlID09PSAndG91Y2gnO1xuICB9XG59XG4iLCIiXX0=