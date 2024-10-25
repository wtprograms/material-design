import { AfterViewInit } from '@angular/core';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { PopoverComponent, PopoverTrigger } from '../popover/popover.component';
import { SlotDirective } from '../../directives/slot.directive';
import { OpenCloseState } from '../../common/rxjs/open-close';
import * as i0 from "@angular/core";
export type FieldVariant = 'filled' | 'outlined';
export declare class FieldComponent<TValue> extends MaterialDesignValueAccessorComponent<TValue> implements AfterViewInit {
    readonly value: import("@angular/core").ModelSignal<TValue | undefined>;
    readonly variant: import("@angular/core").ModelSignal<FieldVariant>;
    readonly label: import("@angular/core").ModelSignal<string | undefined>;
    readonly populated: import("@angular/core").ModelSignal<boolean>;
    readonly contentClick: import("@angular/core").OutputEmitterRef<Event>;
    readonly bodyClick: import("@angular/core").OutputEmitterRef<Event>;
    private readonly _labelSpan;
    private readonly _content;
    readonly popover: import("@angular/core").Signal<PopoverComponent | undefined>;
    private readonly _textDirection;
    readonly open: import("@angular/core").ModelSignal<boolean>;
    readonly popoverTrigger: import("@angular/core").ModelSignal<PopoverTrigger>;
    readonly maxPopoverHeight: import("@angular/core").ModelSignal<number | undefined>;
    readonly popoverStateChange: import("@angular/core").OutputEmitterRef<OpenCloseState>;
    readonly leadingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly popoverSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly trailingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly supportingTextSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly counterSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly prefixSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly suffixSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    private readonly _labelStart;
    private readonly _transition;
    readonly labelStyle: import("@angular/core").Signal<Partial<CSSStyleDeclaration>>;
    readonly contentStyle: import("@angular/core").Signal<Partial<CSSStyleDeclaration>>;
    private readonly _labelWidth;
    readonly borderTopEndStyle: import("@angular/core").Signal<Partial<CSSStyleDeclaration>>;
    private readonly _destroyRef;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FieldComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FieldComponent<any>, "md-field", never, { "value": { "alias": "value"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "populated": { "alias": "populated"; "required": false; "isSignal": true; }; "open": { "alias": "open"; "required": false; "isSignal": true; }; "popoverTrigger": { "alias": "popoverTrigger"; "required": false; "isSignal": true; }; "maxPopoverHeight": { "alias": "maxPopoverHeight"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; "variant": "variantChange"; "label": "labelChange"; "populated": "populatedChange"; "contentClick": "contentClick"; "bodyClick": "bodyClick"; "open": "openChange"; "popoverTrigger": "popoverTriggerChange"; "maxPopoverHeight": "maxPopoverHeightChange"; "popoverStateChange": "popoverStateChange"; }, never, never, true, never>;
}
