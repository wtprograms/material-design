import { ChangeDetectionStrategy, Component, computed, effect, inject, model, viewChild, ViewEncapsulation, } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { PopoverComponent } from '../popover/popover.component';
import { attach, AttachableDirective, } from '../../directives/attachable.directive';
import { AnimationDirective } from '../../directives/animation/animation.directive';
import { Animator } from '../../directives/animation/animator';
import { ButtonComponent } from '../button/button.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/attachable.directive";
export class TooltipComponent extends MaterialDesignComponent {
    variant = model('plain');
    placement = model('bottom');
    trigger = model('hover');
    offset = model(8);
    manualClose = model(false);
    popover = viewChild('popover');
    attachableDirective = inject(AttachableDirective);
    modal = model(false);
    state = computed(() => this.popover()?.state() ?? 'closed');
    headlineSlot = this.slotDirective('headline');
    actionSlot = this.slotDirective('action');
    scrimAnimation = [
        new Animator('opening', {
            keyframes: { opacity: 0.32 },
            options: { easing: 'standardDecelerate' },
        }),
        new Animator('closing', {
            keyframes: { opacity: 0 },
            options: { duration: 'short3', easing: 'standardAccelerate' },
        }),
    ];
    constructor() {
        super();
        attach('pointerenter', 'pointerleave');
        effect(() => {
            const state = this.state();
            const modal = this.modal();
            const target = this.popover()?.attachableDirective?.targetElement();
            if (!target) {
                return;
            }
            if (modal) {
                if (state === 'opening') {
                    target.style.zIndex = 'var(--md-sys-z-index-popover)';
                }
                else if (state === 'closed') {
                    target.style.zIndex = '';
                }
            }
        });
        this.setSlots(ButtonComponent, (x) => {
            x.hostElement.slot = 'action';
            x.variant.set('text');
        });
    }
    openTooltip() {
        this.popover()?.open?.set(true);
    }
    closeTooltip() {
        this.popover()?.open?.set(false);
    }
    onActionClick() {
        this.closeTooltip();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: TooltipComponent, isStandalone: true, selector: "md-tooltip", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, placement: { classPropertyName: "placement", publicName: "placement", isSignal: true, isRequired: false, transformFunction: null }, trigger: { classPropertyName: "trigger", publicName: "trigger", isSignal: true, isRequired: false, transformFunction: null }, offset: { classPropertyName: "offset", publicName: "offset", isSignal: true, isRequired: false, transformFunction: null }, manualClose: { classPropertyName: "manualClose", publicName: "manualClose", isSignal: true, isRequired: false, transformFunction: null }, modal: { classPropertyName: "modal", publicName: "modal", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { variant: "variantChange", placement: "placementChange", trigger: "triggerChange", offset: "offsetChange", manualClose: "manualCloseChange", modal: "modalChange" }, host: { properties: { "attr.variant": "variant()", "attr.headline": "headlineSlot()?.any() || null", "attr.actions": "actionSlot()?.any() || null", "attr.state": "state()" } }, viewQueries: [{ propertyName: "popover", first: true, predicate: ["popover"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: i1.AttachableDirective, inputs: ["target", "target"] }], ngImport: i0, template: "@if (modal()) {\n<div mdAnimation [mdAnimationAnimators]=\"scrimAnimation\" [mdAnimationState]=\"state()\" part=\"scrim\" class=\"scrim\"></div>\n}\n<md-popover #popover part=\"popover\" [target]=\"attachableDirective.target()\" [offset]=\"offset()\"\n  [placement]=\"placement()\" [trigger]=\"trigger()\" [manualClose]=\"manualClose() || !!actionSlot()?.any()\" [delay]=\"500\">\n  @if (variant() === 'plain') {\n  <slot></slot>\n  } @else {\n  <span part=\"headline\" class=\"headline\">\n    <slot name=\"headline\"></slot>\n  </span>\n  <slot></slot>\n  <span part=\"actions\" class=\"actions\">\n    <slot name=\"action\" (click)=\"onActionClick()\"></slot>\n  </span>\n  }\n</md-popover>", styles: [":host{position:absolute;display:inline-flex;flex-direction:column}:host md-popover{max-width:280px;font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host md-popover::part(body){padding:8px}:host ::slotted(md-divider){border-color:var(--md-sys-color-outline-variant)}:host .scrim{display:none;inset:0;opacity:0;position:fixed;z-index:var(--md-sys-z-index-scrim);background:var(--md-sys-color-scrim);transition-property:opacity}:host(:not([state=closed])) .scrim{display:block}:host([variant=plain]){color:var(--md-sys-color-surface-inverse-on)}:host([variant=plain]) md-popover::part(container){background-color:var(--md-sys-color-surface-inverse)}:host([variant=rich]){color:var(--md-sys-color-surface-variant-on)}:host([variant=rich]) md-popover::part(body){padding-top:12px;padding-bottom:8px;padding-inline:16px}:host([variant=rich]) .headline{display:none;margin-bottom:4px;color:var(--md-sys-color-surface-on);font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([variant=rich]) .actions{margin-inline-start:-12px;display:none;margin-top:12px;justify-content:flex-start;gap:8px}:host([headline=true]) .headline{display:inline-flex}:host([actions=true]) .actions{display:inline-flex}\n"], dependencies: [{ kind: "component", type: PopoverComponent, selector: "md-popover", inputs: ["trigger", "flip", "shift", "offset", "delay", "placement", "strategy", "native", "open", "manualClose", "useContainerWidth"], outputs: ["triggerChange", "flipChange", "shiftChange", "offsetChange", "delayChange", "placementChange", "strategyChange", "nativeChange", "openChange", "manualCloseChange", "useContainerWidthChange", "stateChange"] }, { kind: "directive", type: AnimationDirective, selector: "[mdAnimation]", inputs: ["mdAnimation", "mdAnimationAnimators", "mdAnimationState"], outputs: ["mdAnimationChange", "mdAnimationAnimatorsChange", "mdAnimationStateChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-tooltip', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [PopoverComponent, AnimationDirective, SlotDirective], hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['target'],
                        },
                    ], host: {
                        '[attr.variant]': 'variant()',
                        '[attr.headline]': `headlineSlot()?.any() || null`,
                        '[attr.actions]': `actionSlot()?.any() || null`,
                        '[attr.state]': 'state()',
                    }, template: "@if (modal()) {\n<div mdAnimation [mdAnimationAnimators]=\"scrimAnimation\" [mdAnimationState]=\"state()\" part=\"scrim\" class=\"scrim\"></div>\n}\n<md-popover #popover part=\"popover\" [target]=\"attachableDirective.target()\" [offset]=\"offset()\"\n  [placement]=\"placement()\" [trigger]=\"trigger()\" [manualClose]=\"manualClose() || !!actionSlot()?.any()\" [delay]=\"500\">\n  @if (variant() === 'plain') {\n  <slot></slot>\n  } @else {\n  <span part=\"headline\" class=\"headline\">\n    <slot name=\"headline\"></slot>\n  </span>\n  <slot></slot>\n  <span part=\"actions\" class=\"actions\">\n    <slot name=\"action\" (click)=\"onActionClick()\"></slot>\n  </span>\n  }\n</md-popover>", styles: [":host{position:absolute;display:inline-flex;flex-direction:column}:host md-popover{max-width:280px;font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host md-popover::part(body){padding:8px}:host ::slotted(md-divider){border-color:var(--md-sys-color-outline-variant)}:host .scrim{display:none;inset:0;opacity:0;position:fixed;z-index:var(--md-sys-z-index-scrim);background:var(--md-sys-color-scrim);transition-property:opacity}:host(:not([state=closed])) .scrim{display:block}:host([variant=plain]){color:var(--md-sys-color-surface-inverse-on)}:host([variant=plain]) md-popover::part(container){background-color:var(--md-sys-color-surface-inverse)}:host([variant=rich]){color:var(--md-sys-color-surface-variant-on)}:host([variant=rich]) md-popover::part(body){padding-top:12px;padding-bottom:8px;padding-inline:16px}:host([variant=rich]) .headline{display:none;margin-bottom:4px;color:var(--md-sys-color-surface-on);font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([variant=rich]) .actions{margin-inline-start:-12px;display:none;margin-top:12px;justify-content:flex-start;gap:8px}:host([headline=true]) .headline{display:inline-flex}:host([actions=true]) .actions{display:inline-flex}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2NvbXBvbmVudHMvdG9vbHRpcC90b29sdGlwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsUUFBUSxFQUNSLE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGdCQUFnQixFQUFrQixNQUFNLDhCQUE4QixDQUFDO0FBRWhGLE9BQU8sRUFDTCxNQUFNLEVBQ04sbUJBQW1CLEdBQ3BCLE1BQU0sdUNBQXVDLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDcEYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUM7OztBQXlCaEUsTUFBTSxPQUFPLGdCQUFpQixTQUFRLHVCQUF1QjtJQUNsRCxPQUFPLEdBQUcsS0FBSyxDQUFpQixPQUFPLENBQUMsQ0FBQztJQUN6QyxTQUFTLEdBQUcsS0FBSyxDQUFZLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sR0FBRyxLQUFLLENBQWlCLE9BQU8s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VixJQUFJLG1CQUNDLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLFNBQVMsV0FDakMsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLENBQUMsa0JBQzlDO3dCQUNkOzRCQUNFLFNBQVMsRUFBRSxtQkFBbUI7NEJBQzlCLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzt5QkFDbkI7cUJBQ0YsUUFDSzt3QkFDSixnQkFBZ0IsRUFBRSxXQUFXO3dCQUM3QixpQkFBaUIsRUFBRSwrQkFBK0I7d0JBQ2xELGdCQUFnQixFQUFFLDZCQUE2Qjt3QkFDL0MsY0FBYyxFQUFFLFNBQVM7cUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgY29tcHV0ZWQsXG4gIGVmZmVjdCxcbiAgaW5qZWN0LFxuICBtb2RlbCxcbiAgdmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudCB9IGZyb20gJy4uL21hdGVyaWFsLWRlc2lnbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgUG9wb3ZlckNvbXBvbmVudCwgUG9wb3ZlclRyaWdnZXIgfSBmcm9tICcuLi9wb3BvdmVyL3BvcG92ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFBsYWNlbWVudCB9IGZyb20gJ0BmbG9hdGluZy11aS9kb20nO1xuaW1wb3J0IHtcbiAgYXR0YWNoLFxuICBBdHRhY2hhYmxlRGlyZWN0aXZlLFxufSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2F0dGFjaGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IEFuaW1hdGlvbkRpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYW5pbWF0aW9uL2FuaW1hdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQW5pbWF0b3IgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2FuaW1hdGlvbi9hbmltYXRvcic7XG5pbXBvcnQgeyBCdXR0b25Db21wb25lbnQgfSBmcm9tICcuLi9idXR0b24vYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTbG90RGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9zbG90LmRpcmVjdGl2ZSc7XG5cbmV4cG9ydCB0eXBlIFRvb2x0aXBWYXJpYW50ID0gJ3BsYWluJyB8ICdyaWNoJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWQtdG9vbHRpcCcsXG4gIHRlbXBsYXRlVXJsOiAnLi90b29sdGlwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL3Rvb2x0aXAuY29tcG9uZW50LnNjc3MnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tLFxuICBpbXBvcnRzOiBbUG9wb3ZlckNvbXBvbmVudCwgQW5pbWF0aW9uRGlyZWN0aXZlLCBTbG90RGlyZWN0aXZlXSxcbiAgaG9zdERpcmVjdGl2ZXM6IFtcbiAgICB7XG4gICAgICBkaXJlY3RpdmU6IEF0dGFjaGFibGVEaXJlY3RpdmUsXG4gICAgICBpbnB1dHM6IFsndGFyZ2V0J10sXG4gICAgfSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci52YXJpYW50XSc6ICd2YXJpYW50KCknLFxuICAgICdbYXR0ci5oZWFkbGluZV0nOiBgaGVhZGxpbmVTbG90KCk/LmFueSgpIHx8IG51bGxgLFxuICAgICdbYXR0ci5hY3Rpb25zXSc6IGBhY3Rpb25TbG90KCk/LmFueSgpIHx8IG51bGxgLFxuICAgICdbYXR0ci5zdGF0ZV0nOiAnc3RhdGUoKScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIFRvb2x0aXBDb21wb25lbnQgZXh0ZW5kcyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudCB7XG4gIHJlYWRvbmx5IHZhcmlhbnQgPSBtb2RlbDxUb29sdGlwVmFyaWFudD4oJ3BsYWluJyk7XG4gIHJlYWRvbmx5IHBsYWNlbWVudCA9IG1vZGVsPFBsYWNlbWVudD4oJ2JvdHRvbScpO1xuICByZWFkb25seSB0cmlnZ2VyID0gbW9kZWw8UG9wb3ZlclRyaWdnZXI+KCdob3ZlcicpO1xuICByZWFkb25seSBvZmZzZXQgPSBtb2RlbCg4KTtcbiAgcmVhZG9ubHkgbWFudWFsQ2xvc2UgPSBtb2RlbChmYWxzZSk7XG4gIHJlYWRvbmx5IHBvcG92ZXIgPSB2aWV3Q2hpbGQ8UG9wb3ZlckNvbXBvbmVudD4oJ3BvcG92ZXInKTtcbiAgcmVhZG9ubHkgYXR0YWNoYWJsZURpcmVjdGl2ZSA9IGluamVjdChBdHRhY2hhYmxlRGlyZWN0aXZlKTtcbiAgcmVhZG9ubHkgbW9kYWwgPSBtb2RlbChmYWxzZSk7XG5cbiAgcmVhZG9ubHkgc3RhdGUgPSBjb21wdXRlZCgoKSA9PiB0aGlzLnBvcG92ZXIoKT8uc3RhdGUoKSA/PyAnY2xvc2VkJyk7XG5cbiAgcmVhZG9ubHkgaGVhZGxpbmVTbG90ID0gdGhpcy5zbG90RGlyZWN0aXZlKCdoZWFkbGluZScpO1xuICByZWFkb25seSBhY3Rpb25TbG90ID0gdGhpcy5zbG90RGlyZWN0aXZlKCdhY3Rpb24nKTtcblxuICByZWFkb25seSBzY3JpbUFuaW1hdGlvbiA9IFtcbiAgICBuZXcgQW5pbWF0b3IoJ29wZW5pbmcnLCB7XG4gICAgICBrZXlmcmFtZXM6IHsgb3BhY2l0eTogMC4zMiB9LFxuICAgICAgb3B0aW9uczogeyBlYXNpbmc6ICdzdGFuZGFyZERlY2VsZXJhdGUnIH0sXG4gICAgfSksXG4gICAgbmV3IEFuaW1hdG9yKCdjbG9zaW5nJywge1xuICAgICAga2V5ZnJhbWVzOiB7IG9wYWNpdHk6IDAgfSxcbiAgICAgIG9wdGlvbnM6IHsgZHVyYXRpb246ICdzaG9ydDMnLCBlYXNpbmc6ICdzdGFuZGFyZEFjY2VsZXJhdGUnIH0sXG4gICAgfSksXG4gIF07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBhdHRhY2goJ3BvaW50ZXJlbnRlcicsICdwb2ludGVybGVhdmUnKTtcbiAgICBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlKCk7XG4gICAgICBjb25zdCBtb2RhbCA9IHRoaXMubW9kYWwoKTtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMucG9wb3ZlcigpPy5hdHRhY2hhYmxlRGlyZWN0aXZlPy50YXJnZXRFbGVtZW50KCk7XG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAobW9kYWwpIHtcbiAgICAgICAgaWYgKHN0YXRlID09PSAnb3BlbmluZycpIHtcbiAgICAgICAgICB0YXJnZXQuc3R5bGUuekluZGV4ID0gJ3ZhcigtLW1kLXN5cy16LWluZGV4LXBvcG92ZXIpJztcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgICB0YXJnZXQuc3R5bGUuekluZGV4ID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnNldFNsb3RzKEJ1dHRvbkNvbXBvbmVudCwgKHgpID0+IHtcbiAgICAgIHguaG9zdEVsZW1lbnQuc2xvdCA9ICdhY3Rpb24nO1xuICAgICAgeC52YXJpYW50LnNldCgndGV4dCcpO1xuICAgIH0pO1xuICB9XG5cbiAgb3BlblRvb2x0aXAoKSB7XG4gICAgdGhpcy5wb3BvdmVyKCk/Lm9wZW4/LnNldCh0cnVlKTtcbiAgfVxuXG4gIGNsb3NlVG9vbHRpcCgpIHtcbiAgICB0aGlzLnBvcG92ZXIoKT8ub3Blbj8uc2V0KGZhbHNlKTtcbiAgfVxuXG4gIG9uQWN0aW9uQ2xpY2soKSB7XG4gICAgdGhpcy5jbG9zZVRvb2x0aXAoKTtcbiAgfVxufVxuIiwiQGlmIChtb2RhbCgpKSB7XG48ZGl2IG1kQW5pbWF0aW9uIFttZEFuaW1hdGlvbkFuaW1hdG9yc109XCJzY3JpbUFuaW1hdGlvblwiIFttZEFuaW1hdGlvblN0YXRlXT1cInN0YXRlKClcIiBwYXJ0PVwic2NyaW1cIiBjbGFzcz1cInNjcmltXCI+PC9kaXY+XG59XG48bWQtcG9wb3ZlciAjcG9wb3ZlciBwYXJ0PVwicG9wb3ZlclwiIFt0YXJnZXRdPVwiYXR0YWNoYWJsZURpcmVjdGl2ZS50YXJnZXQoKVwiIFtvZmZzZXRdPVwib2Zmc2V0KClcIlxuICBbcGxhY2VtZW50XT1cInBsYWNlbWVudCgpXCIgW3RyaWdnZXJdPVwidHJpZ2dlcigpXCIgW21hbnVhbENsb3NlXT1cIm1hbnVhbENsb3NlKCkgfHwgISFhY3Rpb25TbG90KCk/LmFueSgpXCIgW2RlbGF5XT1cIjUwMFwiPlxuICBAaWYgKHZhcmlhbnQoKSA9PT0gJ3BsYWluJykge1xuICA8c2xvdD48L3Nsb3Q+XG4gIH0gQGVsc2Uge1xuICA8c3BhbiBwYXJ0PVwiaGVhZGxpbmVcIiBjbGFzcz1cImhlYWRsaW5lXCI+XG4gICAgPHNsb3QgbmFtZT1cImhlYWRsaW5lXCI+PC9zbG90PlxuICA8L3NwYW4+XG4gIDxzbG90Pjwvc2xvdD5cbiAgPHNwYW4gcGFydD1cImFjdGlvbnNcIiBjbGFzcz1cImFjdGlvbnNcIj5cbiAgICA8c2xvdCBuYW1lPVwiYWN0aW9uXCIgKGNsaWNrKT1cIm9uQWN0aW9uQ2xpY2soKVwiPjwvc2xvdD5cbiAgPC9zcGFuPlxuICB9XG48L21kLXBvcG92ZXI+Il19