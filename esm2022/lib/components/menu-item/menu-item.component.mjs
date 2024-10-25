import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, model, viewChild, computed, HostListener, } from '@angular/core';
import { textDirection } from '../../common/rxjs/text-direction';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignComponent } from '../material-design.component';
import { MenuComponent } from '../menu/menu.component';
import { RippleComponent } from '../ripple/ripple.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class MenuItemComponent extends MaterialDesignComponent {
    checkOnSelected = model(false);
    disabled = model(false);
    type = model('button');
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    selected = model(false);
    leadingSlot = this.slotDirective('leading');
    trailingSlot = this.slotDirective('trailing');
    itemSlot = this.slotDirective('item');
    button = viewChild('button');
    subMenu = viewChild('menu');
    dir = textDirection();
    placement = computed(() => this.dir() === 'ltr' ? 'right-start' : 'left-start');
    constructor() {
        super();
        this.setSlots(MenuItemComponent, (x) => (x.hostElement.slot = 'item'));
    }
    onClick(event) {
        if (this.itemSlot()?.any()) {
            if (this.hostElement === event.target) {
                this.subMenu()?.popover()?.open.set?.(true);
            }
        }
        else {
            this.hostElement.dispatchEvent(new Event('close-popover', { bubbles: true }));
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MenuItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: MenuItemComponent, isStandalone: true, selector: "md-menu-item", inputs: { checkOnSelected: { classPropertyName: "checkOnSelected", publicName: "checkOnSelected", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { checkOnSelected: "checkOnSelectedChange", disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", selected: "selectedChange" }, host: { listeners: { "click": "onClick($event)" }, properties: { "attr.leading": "leadingSlot()?.any() || null", "attr.trailing": "trailingSlot()?.any() || null", "attr.selected": "selected() || null", "attr.disabled": "disabled() || null", "attr.items": "itemSlot()?.any() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }, { propertyName: "subMenu", first: true, predicate: ["menu"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  @if (checkOnSelected() && selected()) {\n  <md-icon [filled]=\"true\">check</md-icon>\n  } @else {\n  <slot name=\"leading\"></slot>\n  }\n  <slot></slot>\n  @if (itemSlot()?.any()) {\n  @if (dir() === 'ltr') {\n  <md-icon class=\"end\">arrow_right</md-icon>\n  } @else {\n  <md-icon class=\"end\">arrow_left</md-icon>\n  }\n  } @else {\n  <span class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </span>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n<md-menu #menu [target]=\"hostElement\" [placement]=\"placement()\" [offset]=\"0\" trigger=\"manual\">\n  <slot name=\"item\"></slot>\n</md-menu>", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;height:48px;gap:0;cursor:pointer;transition-property:opacity,background-color,color,border-color;flex-shrink:0;color:var(--md-sys-color-surface-variant-on);padding-inline-start:12px;padding-inline-end:12px;align-items:center;gap:12px;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);width:100%}:host .trailing{margin-inline-start:auto;display:none}:host .end{margin-inline-start:auto}:host ::slotted(md-icon),:host md-icon{--md-comp-icon-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-menu{display:none}:host([trailing=true]) .trailing{display:inline-flex}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]) ::slotted(md-icon),:host([selected=true]) md-icon{--md-comp-icon-filled: 1}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([items=true]) md-menu{display:inline-flex}:host([leading=true]){--_padding-start: var(--_padding-addon)}:host([trailing=true]){--_padding-end: var(--_padding-addon)}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: MenuComponent, selector: "md-menu", inputs: ["placement", "trigger", "offset", "useContainerWidth"], outputs: ["placementChange", "triggerChange", "offsetChange", "useContainerWidthChange"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MenuItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-menu-item', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        FocusRingComponent,
                        RippleComponent,
                        TouchAreaComponent,
                        MenuComponent,
                        IconComponent,
                        CommonModule,
                        SlotDirective,
                    ], hostDirectives: [], host: {
                        '[attr.leading]': 'leadingSlot()?.any() || null',
                        '[attr.trailing]': 'trailingSlot()?.any() || null',
                        '[attr.selected]': 'selected() || null',
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.items]': `itemSlot()?.any() || null`,
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  @if (checkOnSelected() && selected()) {\n  <md-icon [filled]=\"true\">check</md-icon>\n  } @else {\n  <slot name=\"leading\"></slot>\n  }\n  <slot></slot>\n  @if (itemSlot()?.any()) {\n  @if (dir() === 'ltr') {\n  <md-icon class=\"end\">arrow_right</md-icon>\n  } @else {\n  <md-icon class=\"end\">arrow_left</md-icon>\n  }\n  } @else {\n  <span class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </span>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n<md-menu #menu [target]=\"hostElement\" [placement]=\"placement()\" [offset]=\"0\" trigger=\"manual\">\n  <slot name=\"item\"></slot>\n</md-menu>", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;height:48px;gap:0;cursor:pointer;transition-property:opacity,background-color,color,border-color;flex-shrink:0;color:var(--md-sys-color-surface-variant-on);padding-inline-start:12px;padding-inline-end:12px;align-items:center;gap:12px;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);width:100%}:host .trailing{margin-inline-start:auto;display:none}:host .end{margin-inline-start:auto}:host ::slotted(md-icon),:host md-icon{--md-comp-icon-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-menu{display:none}:host([trailing=true]) .trailing{display:inline-flex}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]) ::slotted(md-icon),:host([selected=true]) md-icon{--md-comp-icon-filled: 1}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([items=true]) md-menu{display:inline-flex}:host([leading=true]){--_padding-start: var(--_padding-addon)}:host([trailing=true]){--_padding-end: var(--_padding-addon)}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }], ctorParameters: () => [], propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9tZW51LWl0ZW0vbWVudS1pdGVtLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9tZW51LWl0ZW0vbWVudS1pdGVtLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsS0FBSyxFQUNMLFNBQVMsRUFFVCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUM7OztBQTJCaEUsTUFBTSxPQUFPLGlCQUFrQixTQUFRLHVCQUF1QjtJQUNuRCxlQUFlLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsSUFBSSxHQUFHLEtBQUssQ0FBb0IsUUFBUSxDQUFDLENBQUM7SUFDMUMsSUFBSSxHQUFHLEtBQUssRUFBVSxDQUFDO0lBQ3ZCLFlBQVksR0FBRyxLQUFLLEVBQVUsQ0FBQztJQUMvQixJQUFJLEdBQUcsS0FBSyxFQUFVLENBQUM7SUFDdkIsS0FBSyxHQUFHLEtBQUssRUFBVSxDQUFDO0lBQ3hCLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFeEIsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDOUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEMsTUFBTSxHQUNiLFNBQVMsQ0FBb0QsUUFBUSxDQUFDLENBQUM7SUFFaEUsT0FBTyxHQUFHLFNBQVMsQ0FBZ0IsTUFBTSxDQUFDLENBQUM7SUFFM0MsR0FBRyxHQUFHLGFBQWEsRUFBRSxDQUFDO0lBQ3RCLFNBQVMsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQ2pDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUNwRCxDQUFDO0lBRUY7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBR0QsT0FBTyxDQUFDLEtBQVk7UUFDbEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUMzQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlDLENBQUM7UUFDSCxDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUM1QixJQUFJLEtBQUssQ0FBQyxlQUFlLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FDOUMsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO3VHQXhDVSxpQkFBaUI7MkZBQWpCLGlCQUFpQixnMERDOUM5QixtcUNBcUNVLHNrRURSTixrQkFBa0IscUhBQ2xCLGVBQWUsMkpBQ2Ysa0JBQWtCLDBEQUNsQixhQUFhLCtNQUNiLGFBQWEsZ05BQ2IsWUFBWSxzTUFDWixhQUFhOzsyRkFXSixpQkFBaUI7a0JBekI3QixTQUFTOytCQUNFLGNBQWMsY0FHWixJQUFJLG1CQUNDLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLFNBQVMsV0FDakM7d0JBQ1Asa0JBQWtCO3dCQUNsQixlQUFlO3dCQUNmLGtCQUFrQjt3QkFDbEIsYUFBYTt3QkFDYixhQUFhO3dCQUNiLFlBQVk7d0JBQ1osYUFBYTtxQkFDZCxrQkFDZSxFQUFFLFFBQ1o7d0JBQ0osZ0JBQWdCLEVBQUUsOEJBQThCO3dCQUNoRCxpQkFBaUIsRUFBRSwrQkFBK0I7d0JBQ2xELGlCQUFpQixFQUFFLG9CQUFvQjt3QkFDdkMsaUJBQWlCLEVBQUUsb0JBQW9CO3dCQUN2QyxjQUFjLEVBQUUsMkJBQTJCO3FCQUM1Qzt3REFnQ0QsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgbW9kZWwsXG4gIHZpZXdDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgY29tcHV0ZWQsXG4gIEhvc3RMaXN0ZW5lcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtU3VibWl0dGVyVHlwZSB9IGZyb20gJy4uLy4uL2NvbW1vbi9mb3Jtcy9mb3JtLXN1Ym1pdHRlZC10eXBlJztcbmltcG9ydCB7IHRleHREaXJlY3Rpb24gfSBmcm9tICcuLi8uLi9jb21tb24vcnhqcy90ZXh0LWRpcmVjdGlvbic7XG5pbXBvcnQgeyBGb2N1c1JpbmdDb21wb25lbnQgfSBmcm9tICcuLi9mb2N1cy1yaW5nL2ZvY3VzLXJpbmcuY29tcG9uZW50JztcbmltcG9ydCB7IEljb25Db21wb25lbnQgfSBmcm9tICcuLi9pY29uL2ljb24uY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsRGVzaWduQ29tcG9uZW50IH0gZnJvbSAnLi4vbWF0ZXJpYWwtZGVzaWduLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZW51Q29tcG9uZW50IH0gZnJvbSAnLi4vbWVudS9tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSaXBwbGVDb21wb25lbnQgfSBmcm9tICcuLi9yaXBwbGUvcmlwcGxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUb3VjaEFyZWFDb21wb25lbnQgfSBmcm9tICcuLi90b3VjaC1hcmVhL3RvdWNoLWFyZWEuY29tcG9uZW50JztcbmltcG9ydCB7IFNsb3REaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Nsb3QuZGlyZWN0aXZlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWQtbWVudS1pdGVtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21lbnUtaXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9tZW51LWl0ZW0uY29tcG9uZW50LnNjc3MnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tLFxuICBpbXBvcnRzOiBbXG4gICAgRm9jdXNSaW5nQ29tcG9uZW50LFxuICAgIFJpcHBsZUNvbXBvbmVudCxcbiAgICBUb3VjaEFyZWFDb21wb25lbnQsXG4gICAgTWVudUNvbXBvbmVudCxcbiAgICBJY29uQ29tcG9uZW50LFxuICAgIENvbW1vbk1vZHVsZSxcbiAgICBTbG90RGlyZWN0aXZlLFxuICBdLFxuICBob3N0RGlyZWN0aXZlczogW10sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIubGVhZGluZ10nOiAnbGVhZGluZ1Nsb3QoKT8uYW55KCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLnRyYWlsaW5nXSc6ICd0cmFpbGluZ1Nsb3QoKT8uYW55KCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLnNlbGVjdGVkXSc6ICdzZWxlY3RlZCgpIHx8IG51bGwnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQoKSB8fCBudWxsJyxcbiAgICAnW2F0dHIuaXRlbXNdJzogYGl0ZW1TbG90KCk/LmFueSgpIHx8IG51bGxgLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNZW51SXRlbUNvbXBvbmVudCBleHRlbmRzIE1hdGVyaWFsRGVzaWduQ29tcG9uZW50IHtcbiAgcmVhZG9ubHkgY2hlY2tPblNlbGVjdGVkID0gbW9kZWwoZmFsc2UpO1xuICByZWFkb25seSBkaXNhYmxlZCA9IG1vZGVsKGZhbHNlKTtcbiAgcmVhZG9ubHkgdHlwZSA9IG1vZGVsPEZvcm1TdWJtaXR0ZXJUeXBlPignYnV0dG9uJyk7XG4gIHJlYWRvbmx5IGhyZWYgPSBtb2RlbDxzdHJpbmc+KCk7XG4gIHJlYWRvbmx5IGFuY2hvclRhcmdldCA9IG1vZGVsPHN0cmluZz4oKTtcbiAgcmVhZG9ubHkgbmFtZSA9IG1vZGVsPHN0cmluZz4oKTtcbiAgcmVhZG9ubHkgdmFsdWUgPSBtb2RlbDxzdHJpbmc+KCk7XG4gIHJlYWRvbmx5IHNlbGVjdGVkID0gbW9kZWwoZmFsc2UpO1xuXG4gIHJlYWRvbmx5IGxlYWRpbmdTbG90ID0gdGhpcy5zbG90RGlyZWN0aXZlKCdsZWFkaW5nJyk7XG4gIHJlYWRvbmx5IHRyYWlsaW5nU2xvdCA9IHRoaXMuc2xvdERpcmVjdGl2ZSgndHJhaWxpbmcnKTtcbiAgcmVhZG9ubHkgaXRlbVNsb3QgPSB0aGlzLnNsb3REaXJlY3RpdmUoJ2l0ZW0nKTtcblxuICByZWFkb25seSBidXR0b24gPVxuICAgIHZpZXdDaGlsZDxFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50IHwgSFRNTEFuY2hvckVsZW1lbnQ+PignYnV0dG9uJyk7XG5cbiAgcmVhZG9ubHkgc3ViTWVudSA9IHZpZXdDaGlsZDxNZW51Q29tcG9uZW50PignbWVudScpO1xuXG4gIHJlYWRvbmx5IGRpciA9IHRleHREaXJlY3Rpb24oKTtcbiAgcmVhZG9ubHkgcGxhY2VtZW50ID0gY29tcHV0ZWQoKCkgPT5cbiAgICB0aGlzLmRpcigpID09PSAnbHRyJyA/ICdyaWdodC1zdGFydCcgOiAnbGVmdC1zdGFydCdcbiAgKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc2V0U2xvdHMoTWVudUl0ZW1Db21wb25lbnQsICh4KSA9PiAoeC5ob3N0RWxlbWVudC5zbG90ID0gJ2l0ZW0nKSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXRlbVNsb3QoKT8uYW55KCkpIHtcbiAgICAgIGlmICh0aGlzLmhvc3RFbGVtZW50ID09PSBldmVudC50YXJnZXQpIHtcbiAgICAgICAgdGhpcy5zdWJNZW51KCk/LnBvcG92ZXIoKT8ub3Blbi5zZXQ/Lih0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ob3N0RWxlbWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgRXZlbnQoJ2Nsb3NlLXBvcG92ZXInLCB7IGJ1YmJsZXM6IHRydWUgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iLCI8bmctdGVtcGxhdGUgI2NvbnRlbnQ+XG4gIDxtZC10b3VjaC1hcmVhIC8+XG4gIEBpZiAoY2hlY2tPblNlbGVjdGVkKCkgJiYgc2VsZWN0ZWQoKSkge1xuICA8bWQtaWNvbiBbZmlsbGVkXT1cInRydWVcIj5jaGVjazwvbWQtaWNvbj5cbiAgfSBAZWxzZSB7XG4gIDxzbG90IG5hbWU9XCJsZWFkaW5nXCI+PC9zbG90PlxuICB9XG4gIDxzbG90Pjwvc2xvdD5cbiAgQGlmIChpdGVtU2xvdCgpPy5hbnkoKSkge1xuICBAaWYgKGRpcigpID09PSAnbHRyJykge1xuICA8bWQtaWNvbiBjbGFzcz1cImVuZFwiPmFycm93X3JpZ2h0PC9tZC1pY29uPlxuICB9IEBlbHNlIHtcbiAgPG1kLWljb24gY2xhc3M9XCJlbmRcIj5hcnJvd19sZWZ0PC9tZC1pY29uPlxuICB9XG4gIH0gQGVsc2Uge1xuICA8c3BhbiBjbGFzcz1cInRyYWlsaW5nXCI+XG4gICAgPHNsb3QgbmFtZT1cInRyYWlsaW5nXCI+PC9zbG90PlxuICA8L3NwYW4+XG4gIH1cbjwvbmctdGVtcGxhdGU+XG5cbjxtZC1mb2N1cy1yaW5nIHBhcnQ9XCJmb2N1cy1yaW5nXCIgW3RhcmdldF09XCJidXR0b24oKVwiIC8+XG48bWQtcmlwcGxlIHBhcnQ9XCJyaXBwbGVcIiBbdGFyZ2V0XT1cImJ1dHRvbigpXCIgLz5cbkBpZiAoaHJlZigpKSB7XG48YSBwYXJ0PVwiYnV0dG9uXCIgI2J1dHRvbiBbYXR0ci5ocmVmXT1cImhyZWYoKSA/PyBudWxsXCIgW2F0dHIudGFyZ2V0XT1cImFuY2hvclRhcmdldCgpID8/IG51bGxcIlxuICBbdGFiSW5kZXhdPVwiZGlzYWJsZWQoKSA/IC0xIDogMFwiPlxuICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFwiIC8+XG48L2E+XG59IEBlbHNlIHtcbjxidXR0b24gcGFydD1cImJ1dHRvblwiICNidXR0b24gW3R5cGVdPVwidHlwZSgpXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkKCkgfHwgbnVsbFwiIFthdHRyLm5hbWVdPVwibmFtZSgpID8/IG51bGxcIlxuICBbYXR0ci52YWx1ZV09XCJ2YWx1ZSgpID8/IG51bGxcIj5cbiAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNvbnRlbnRcIiAvPlxuPC9idXR0b24+XG59XG5cbjxtZC1tZW51ICNtZW51IFt0YXJnZXRdPVwiaG9zdEVsZW1lbnRcIiBbcGxhY2VtZW50XT1cInBsYWNlbWVudCgpXCIgW29mZnNldF09XCIwXCIgdHJpZ2dlcj1cIm1hbnVhbFwiPlxuICA8c2xvdCBuYW1lPVwiaXRlbVwiPjwvc2xvdD5cbjwvbWQtbWVudT4iXX0=