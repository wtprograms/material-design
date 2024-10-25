import { FieldComponent, FieldVariant } from '../field/field.component';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import * as i0 from "@angular/core";
export declare class DropdownComponent<T> extends MaterialDesignValueAccessorComponent<T> {
    readonly value: import("@angular/core").ModelSignal<T | undefined>;
    readonly variant: import("@angular/core").ModelSignal<FieldVariant>;
    readonly prefix: import("@angular/core").ModelSignal<string | undefined>;
    readonly suffix: import("@angular/core").ModelSignal<string | undefined>;
    readonly label: import("@angular/core").ModelSignal<string | undefined>;
    readonly field: import("@angular/core").Signal<FieldComponent<T> | undefined>;
    readonly selectedValueSlot: import("@angular/core").Signal<import("@wtprograms/material-design").SlotDirective | undefined>;
    readonly populated: import("@angular/core").Signal<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DropdownComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DropdownComponent<any>, "md-dropdown", never, { "value": { "alias": "value"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "prefix": { "alias": "prefix"; "required": false; "isSignal": true; }; "suffix": { "alias": "suffix"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; "variant": "variantChange"; "prefix": "prefixChange"; "suffix": "suffixChange"; "label": "labelChange"; }, never, never, true, never>;
}
