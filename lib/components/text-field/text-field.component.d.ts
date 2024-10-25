import { FieldVariant } from '../field/field.component';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/forward-focus.directive";
export type TextFieldType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'text-area';
export declare class TextFieldComponent extends MaterialDesignValueAccessorComponent<string> {
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly variant: import("@angular/core").ModelSignal<FieldVariant>;
    readonly type: import("@angular/core").ModelSignal<TextFieldType>;
    readonly prefix: import("@angular/core").ModelSignal<string | undefined>;
    readonly suffix: import("@angular/core").ModelSignal<string | undefined>;
    readonly label: import("@angular/core").ModelSignal<string | undefined>;
    readonly supportingText: import("@angular/core").ModelSignal<string | undefined>;
    readonly maxLength: import("@angular/core").ModelSignal<number | undefined>;
    readonly hasDropdown: import("@angular/core").ModelSignal<boolean>;
    selectedItemToTextFn: (value?: string) => string | undefined;
    private readonly _input;
    private readonly _field;
    readonly counterText: import("@angular/core").Signal<string | undefined>;
    readonly populated: import("@angular/core").Signal<boolean | undefined>;
    constructor();
    onContentClick(): void;
    onInput(event: Event): void;
    onItemClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextFieldComponent, "md-text-field", never, { "value": { "alias": "value"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "prefix": { "alias": "prefix"; "required": false; "isSignal": true; }; "suffix": { "alias": "suffix"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "supportingText": { "alias": "supportingText"; "required": false; "isSignal": true; }; "maxLength": { "alias": "maxLength"; "required": false; "isSignal": true; }; "hasDropdown": { "alias": "hasDropdown"; "required": false; "isSignal": true; }; "selectedItemToTextFn": { "alias": "selectedItemToTextFn"; "required": false; }; }, { "value": "valueChange"; "variant": "variantChange"; "type": "typeChange"; "prefix": "prefixChange"; "suffix": "suffixChange"; "label": "labelChange"; "supportingText": "supportingTextChange"; "maxLength": "maxLengthChange"; "hasDropdown": "hasDropdownChange"; }, never, never, true, [{ directive: typeof i1.ForwardFocusDirective; inputs: {}; outputs: {}; }]>;
}
