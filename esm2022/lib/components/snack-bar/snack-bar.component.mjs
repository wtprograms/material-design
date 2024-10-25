import { ChangeDetectionStrategy, Component, effect, inject, model, PLATFORM_ID, ViewEncapsulation, } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { AnimationDirective } from '../../directives/animation/animation.directive';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { animationContext, AnimationContextDirective, } from '../../directives/animation/animation-context.directive';
import { Animator } from '../../directives/animation/animator';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil, timer } from 'rxjs';
import { openClose } from '../../common/rxjs/open-close';
import { toSignal } from '@angular/core/rxjs-interop';
import { ElevationComponent } from '../elevation/elevation.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/animation/animation-context.directive";
export class SnackBarComponent extends MaterialDesignComponent {
    multiline = model(false);
    closeButton = model(false);
    open = model(false);
    autoDissmissTimeout = model(5000);
    actionSlot = this.slotDirective('action');
    animationTriggers = {
        container: [
            new Animator('opening', {
                style: { display: 'inline-flex' },
                keyframes: { transform: 'scaleY(100%)' },
                options: { duration: 'short4', easing: 'standardDecelerate' },
            }),
            new Animator('closing', {
                keyframes: { transform: 'scaleY(0)' },
                options: {
                    duration: 'short2',
                    easing: 'standardAccelerate',
                    delay: 'short1',
                },
            }),
            new Animator('closed', {
                style: { display: 'none', transform: 'scaleY(0)' },
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
    _closing$ = new Subject();
    _openClose = openClose(this.open, 'long1', 'long1');
    state = toSignal(this._openClose);
    constructor() {
        super();
        this.hostElement.popover = 'manual';
        animationContext(this.animationTriggers);
        effect(() => {
            const state = this.state();
            if (state === 'opening' && isPlatformBrowser(this._platformId)) {
                this.hostElement.showPopover();
            }
            if (state === 'closed' && isPlatformBrowser(this._platformId)) {
                this.hostElement.hidePopover();
                this._closing$.next();
            }
            if (state === 'opened') {
                if (this.autoDissmissTimeout() > 0) {
                    timer(this.autoDissmissTimeout())
                        .pipe(takeUntil(this._closing$))
                        .subscribe(() => this.open.set(false));
                }
            }
        });
    }
    onActionClick() {
        this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SnackBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: SnackBarComponent, isStandalone: true, selector: "md-snack-bar", inputs: { multiline: { classPropertyName: "multiline", publicName: "multiline", isSignal: true, isRequired: false, transformFunction: null }, closeButton: { classPropertyName: "closeButton", publicName: "closeButton", isSignal: true, isRequired: false, transformFunction: null }, open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, autoDissmissTimeout: { classPropertyName: "autoDissmissTimeout", publicName: "autoDissmissTimeout", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { multiline: "multilineChange", closeButton: "closeButtonChange", open: "openChange", autoDissmissTimeout: "autoDissmissTimeoutChange" }, host: { properties: { "attr.closeButton": "closeButton() || null", "attr.actions": "actionSlot()?.any() || null", "attr.multiline": "multiline() || null" } }, usesInheritance: true, hostDirectives: [{ directive: i1.AnimationContextDirective }], ngImport: i0, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" class=\"container\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n  <div mdAnimation=\"body\" [mdAnimationState]=\"state()\" class=\"body\">\n    <div>\n      <slot></slot>\n    </div>\n    <div class=\"actions\">\n      <slot #actionSlot name=\"action\" (click)=\"onActionClick()\"></slot>\n      @if (closeButton()) {\n      <md-icon-button (click)=\"open.set(false)\">\n        close\n      </md-icon-button>\n      }\n    </div>\n  </div>\n</div>", styles: [":host{max-width:100%;min-width:280px;display:contents;margin:auto 0 0;position:fixed;height:fit-content;width:100%;z-index:var(--md-sys-z-index-snack-bar);gap:8px;padding:0 0 16px;border:0;overflow:visible;padding-inline:16px}:host .container{position:relative;background-color:var(--md-sys-color-surface-inverse);color:var(--md-sys-color-surface-inverse-on);border-radius:var(--md-sys-shape-extra-small);padding:0;margin:0;gap:inherit;display:inline-flex;flex-direction:column;width:100%;transform-origin:bottom;transform:scaleY(0)}:host .body{display:inline-flex;flex-direction:row;opacity:0;color:inherit;align-items:center;gap:inherit;padding-top:4px;padding-bottom:4px;padding-inline:16px;min-height:48px}:host .actions{gap:8px;display:inline-flex;margin-inline-start:auto}:host md-icon-button{color:inherit}:host ::slotted(md-button){color:var(--md-sys-color-primary-inverse-on)}@media screen and (min-width: 640px){:host{max-width:min(560px,100% - 48px);margin:auto auto 0}}:host([closeButton=true]) .body{padding-inline-end:4px}:host([multiline=true]) .body{flex-direction:column;align-items:flex-start}\n"], dependencies: [{ kind: "component", type: IconButtonComponent, selector: "md-icon-button", inputs: ["disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax", "variant", "selected", "custom", "badgeDot", "badgeNumber"], outputs: ["disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange", "variantChange", "selectedChange", "customChange", "badgeDotChange", "badgeNumberChange"] }, { kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "directive", type: AnimationDirective, selector: "[mdAnimation]", inputs: ["mdAnimation", "mdAnimationAnimators", "mdAnimationState"], outputs: ["mdAnimationChange", "mdAnimationAnimatorsChange", "mdAnimationStateChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SnackBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-snack-bar', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [IconButtonComponent, ElevationComponent, AnimationDirective], hostDirectives: [AnimationContextDirective], host: {
                        '[attr.closeButton]': 'closeButton() || null',
                        '[attr.actions]': 'actionSlot()?.any() || null',
                        '[attr.multiline]': 'multiline() || null',
                    }, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" class=\"container\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n  <div mdAnimation=\"body\" [mdAnimationState]=\"state()\" class=\"body\">\n    <div>\n      <slot></slot>\n    </div>\n    <div class=\"actions\">\n      <slot #actionSlot name=\"action\" (click)=\"onActionClick()\"></slot>\n      @if (closeButton()) {\n      <md-icon-button (click)=\"open.set(false)\">\n        close\n      </md-icon-button>\n      }\n    </div>\n  </div>\n</div>", styles: [":host{max-width:100%;min-width:280px;display:contents;margin:auto 0 0;position:fixed;height:fit-content;width:100%;z-index:var(--md-sys-z-index-snack-bar);gap:8px;padding:0 0 16px;border:0;overflow:visible;padding-inline:16px}:host .container{position:relative;background-color:var(--md-sys-color-surface-inverse);color:var(--md-sys-color-surface-inverse-on);border-radius:var(--md-sys-shape-extra-small);padding:0;margin:0;gap:inherit;display:inline-flex;flex-direction:column;width:100%;transform-origin:bottom;transform:scaleY(0)}:host .body{display:inline-flex;flex-direction:row;opacity:0;color:inherit;align-items:center;gap:inherit;padding-top:4px;padding-bottom:4px;padding-inline:16px;min-height:48px}:host .actions{gap:8px;display:inline-flex;margin-inline-start:auto}:host md-icon-button{color:inherit}:host ::slotted(md-button){color:var(--md-sys-color-primary-inverse-on)}@media screen and (min-width: 640px){:host{max-width:min(560px,100% - 48px);margin:auto auto 0}}:host([closeButton=true]) .body{padding-inline-end:4px}:host([multiline=true]) .body{flex-direction:column;align-items:flex-start}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9zbmFjay1iYXIvc25hY2stYmFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9zbmFjay1iYXIvc25hY2stYmFyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUNMLFdBQVcsRUFDWCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDcEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUNMLGdCQUFnQixFQUNoQix5QkFBeUIsR0FFMUIsTUFBTSx3REFBd0QsQ0FBQztBQUNoRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7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QUssS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDbkMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO3lCQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt5QkFDL0IsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7dUdBM0VVLGlCQUFpQjsyRkFBakIsaUJBQWlCLGlnQ0N2QzlCLDJnQkFlTSxtcENEZ0JNLG1CQUFtQix3Z0JBQUUsa0JBQWtCLHdNQUFFLGtCQUFrQjs7MkZBUTFELGlCQUFpQjtrQkFmN0IsU0FBUzsrQkFDRSxjQUFjLGNBR1osSUFBSSxtQkFDQyx1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxTQUFTLFdBQ2pDLENBQUMsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsa0JBQ3RELENBQUMseUJBQXlCLENBQUMsUUFDckM7d0JBQ0osb0JBQW9CLEVBQUUsdUJBQXVCO3dCQUM3QyxnQkFBZ0IsRUFBRSw2QkFBNkI7d0JBQy9DLGtCQUFrQixFQUFFLHFCQUFxQjtxQkFDMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBlZmZlY3QsXG4gIGluamVjdCxcbiAgbW9kZWwsXG4gIFBMQVRGT1JNX0lELFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudCB9IGZyb20gJy4uL21hdGVyaWFsLWRlc2lnbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9hbmltYXRpb24vYW5pbWF0aW9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJY29uQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi4vaWNvbi1idXR0b24vaWNvbi1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7XG4gIGFuaW1hdGlvbkNvbnRleHQsXG4gIEFuaW1hdGlvbkNvbnRleHREaXJlY3RpdmUsXG4gIEFuaW1hdGlvblRyaWdnZXJzLFxufSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2FuaW1hdGlvbi9hbmltYXRpb24tY29udGV4dC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQW5pbWF0b3IgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2FuaW1hdGlvbi9hbmltYXRvcic7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlVW50aWwsIHRpbWVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBvcGVuQ2xvc2UgfSBmcm9tICcuLi8uLi9jb21tb24vcnhqcy9vcGVuLWNsb3NlJztcbmltcG9ydCB7IHRvU2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9yeGpzLWludGVyb3AnO1xuaW1wb3J0IHsgRWxldmF0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi4vZWxldmF0aW9uL2VsZXZhdGlvbi5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtZC1zbmFjay1iYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vc25hY2stYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL3NuYWNrLWJhci5jb21wb25lbnQuc2NzcycsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb20sXG4gIGltcG9ydHM6IFtJY29uQnV0dG9uQ29tcG9uZW50LCBFbGV2YXRpb25Db21wb25lbnQsIEFuaW1hdGlvbkRpcmVjdGl2ZV0sXG4gIGhvc3REaXJlY3RpdmVzOiBbQW5pbWF0aW9uQ29udGV4dERpcmVjdGl2ZV0sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuY2xvc2VCdXR0b25dJzogJ2Nsb3NlQnV0dG9uKCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFjdGlvbnNdJzogJ2FjdGlvblNsb3QoKT8uYW55KCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm11bHRpbGluZV0nOiAnbXVsdGlsaW5lKCkgfHwgbnVsbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIFNuYWNrQmFyQ29tcG9uZW50IGV4dGVuZHMgTWF0ZXJpYWxEZXNpZ25Db21wb25lbnQge1xuICByZWFkb25seSBtdWx0aWxpbmUgPSBtb2RlbChmYWxzZSk7XG4gIHJlYWRvbmx5IGNsb3NlQnV0dG9uID0gbW9kZWwoZmFsc2UpO1xuICByZWFkb25seSBvcGVuID0gbW9kZWwoZmFsc2UpO1xuICByZWFkb25seSBhdXRvRGlzc21pc3NUaW1lb3V0ID0gbW9kZWwoNTAwMCk7XG5cbiAgcmVhZG9ubHkgYWN0aW9uU2xvdCA9IHRoaXMuc2xvdERpcmVjdGl2ZSgnYWN0aW9uJyk7XG5cbiAgcmVhZG9ubHkgYW5pbWF0aW9uVHJpZ2dlcnM6IEFuaW1hdGlvblRyaWdnZXJzID0ge1xuICAgIGNvbnRhaW5lcjogW1xuICAgICAgbmV3IEFuaW1hdG9yKCdvcGVuaW5nJywge1xuICAgICAgICBzdHlsZTogeyBkaXNwbGF5OiAnaW5saW5lLWZsZXgnIH0sXG4gICAgICAgIGtleWZyYW1lczogeyB0cmFuc2Zvcm06ICdzY2FsZVkoMTAwJSknIH0sXG4gICAgICAgIG9wdGlvbnM6IHsgZHVyYXRpb246ICdzaG9ydDQnLCBlYXNpbmc6ICdzdGFuZGFyZERlY2VsZXJhdGUnIH0sXG4gICAgICB9KSxcbiAgICAgIG5ldyBBbmltYXRvcignY2xvc2luZycsIHtcbiAgICAgICAga2V5ZnJhbWVzOiB7IHRyYW5zZm9ybTogJ3NjYWxlWSgwKScgfSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGR1cmF0aW9uOiAnc2hvcnQyJyxcbiAgICAgICAgICBlYXNpbmc6ICdzdGFuZGFyZEFjY2VsZXJhdGUnLFxuICAgICAgICAgIGRlbGF5OiAnc2hvcnQxJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgbmV3IEFuaW1hdG9yKCdjbG9zZWQnLCB7XG4gICAgICAgIHN0eWxlOiB7IGRpc3BsYXk6ICdub25lJywgdHJhbnNmb3JtOiAnc2NhbGVZKDApJyB9LFxuICAgICAgfSksXG4gICAgXSxcbiAgICBib2R5OiBbXG4gICAgICBuZXcgQW5pbWF0b3IoJ29wZW5pbmcnLCB7XG4gICAgICAgIGtleWZyYW1lczogeyBvcGFjaXR5OiAnMScgfSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGR1cmF0aW9uOiAnc2hvcnQ0JyxcbiAgICAgICAgICBlYXNpbmc6ICdzdGFuZGFyZERlY2VsZXJhdGUnLFxuICAgICAgICAgIGRlbGF5OiAnc2hvcnQzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgbmV3IEFuaW1hdG9yKCdjbG9zaW5nJywge1xuICAgICAgICBrZXlmcmFtZXM6IHsgb3BhY2l0eTogJzAnIH0sXG4gICAgICAgIG9wdGlvbnM6IHsgZHVyYXRpb246ICdzaG9ydDInLCBlYXNpbmc6ICdzdGFuZGFyZEFjY2VsZXJhdGUnIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX3BsYXRmb3JtSWQgPSBpbmplY3QoUExBVEZPUk1fSUQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbG9zaW5nJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfb3BlbkNsb3NlID0gb3BlbkNsb3NlKHRoaXMub3BlbiwgJ2xvbmcxJywgJ2xvbmcxJyk7XG4gIHJlYWRvbmx5IHN0YXRlID0gdG9TaWduYWwodGhpcy5fb3BlbkNsb3NlKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaG9zdEVsZW1lbnQucG9wb3ZlciA9ICdtYW51YWwnO1xuICAgIGFuaW1hdGlvbkNvbnRleHQodGhpcy5hbmltYXRpb25UcmlnZ2Vycyk7XG5cbiAgICBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlKCk7XG4gICAgICBpZiAoc3RhdGUgPT09ICdvcGVuaW5nJyAmJiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKSkge1xuICAgICAgICB0aGlzLmhvc3RFbGVtZW50LnNob3dQb3BvdmVyKCk7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKSB7XG4gICAgICAgIHRoaXMuaG9zdEVsZW1lbnQuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgdGhpcy5fY2xvc2luZyQubmV4dCgpO1xuICAgICAgfVxuICAgICAgaWYgKHN0YXRlID09PSAnb3BlbmVkJykge1xuICAgICAgICBpZiAodGhpcy5hdXRvRGlzc21pc3NUaW1lb3V0KCkgPiAwKSB7XG4gICAgICAgICAgdGltZXIodGhpcy5hdXRvRGlzc21pc3NUaW1lb3V0KCkpXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fY2xvc2luZyQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9wZW4uc2V0KGZhbHNlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uQWN0aW9uQ2xpY2soKSB7XG4gICAgdGhpcy5vcGVuLnNldChmYWxzZSk7XG4gIH1cbn1cbiIsIjxkaXYgbWRBbmltYXRpb249XCJjb250YWluZXJcIiBbbWRBbmltYXRpb25TdGF0ZV09XCJzdGF0ZSgpXCIgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgPG1kLWVsZXZhdGlvbiBwYXJ0PVwiZWxldmF0aW9uXCIgW2xldmVsXT1cIjJcIiAvPlxuICA8ZGl2IG1kQW5pbWF0aW9uPVwiYm9keVwiIFttZEFuaW1hdGlvblN0YXRlXT1cInN0YXRlKClcIiBjbGFzcz1cImJvZHlcIj5cbiAgICA8ZGl2PlxuICAgICAgPHNsb3Q+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhY3Rpb25zXCI+XG4gICAgICA8c2xvdCAjYWN0aW9uU2xvdCBuYW1lPVwiYWN0aW9uXCIgKGNsaWNrKT1cIm9uQWN0aW9uQ2xpY2soKVwiPjwvc2xvdD5cbiAgICAgIEBpZiAoY2xvc2VCdXR0b24oKSkge1xuICAgICAgPG1kLWljb24tYnV0dG9uIChjbGljayk9XCJvcGVuLnNldChmYWxzZSlcIj5cbiAgICAgICAgY2xvc2VcbiAgICAgIDwvbWQtaWNvbi1idXR0b24+XG4gICAgICB9XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+Il19