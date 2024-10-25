import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
export type ProgressIndicatorVariant = 'circular' | 'linear';
export declare class ProgressIndicatorComponent extends MaterialDesignComponent {
    readonly variant: import("@angular/core").ModelSignal<ProgressIndicatorVariant>;
    readonly value: import("@angular/core").ModelSignal<number>;
    readonly max: import("@angular/core").ModelSignal<number>;
    readonly indeterminate: import("@angular/core").ModelSignal<boolean>;
    readonly fourColor: import("@angular/core").ModelSignal<boolean>;
    readonly size: import("@angular/core").ModelSignal<number | undefined>;
    readonly width: import("@angular/core").ModelSignal<number | undefined>;
    readonly buffer: import("@angular/core").ModelSignal<number>;
    readonly circleSize: import("@angular/core").ModelSignal<number | undefined>;
    readonly dashOffset: import("@angular/core").Signal<number>;
    readonly progressStyle: import("@angular/core").Signal<Partial<CSSStyleDeclaration>>;
    readonly dotSize: import("@angular/core").Signal<number>;
    readonly dotStyle: import("@angular/core").Signal<Partial<CSSStyleDeclaration>>;
    readonly hideDots: import("@angular/core").Signal<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProgressIndicatorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProgressIndicatorComponent, "md-progress-indicator", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "max": { "alias": "max"; "required": false; "isSignal": true; }; "indeterminate": { "alias": "indeterminate"; "required": false; "isSignal": true; }; "fourColor": { "alias": "fourColor"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "width": { "alias": "width"; "required": false; "isSignal": true; }; "buffer": { "alias": "buffer"; "required": false; "isSignal": true; }; "circleSize": { "alias": "circleSize"; "required": false; "isSignal": true; }; }, { "variant": "variantChange"; "value": "valueChange"; "max": "maxChange"; "indeterminate": "indeterminateChange"; "fourColor": "fourColorChange"; "size": "sizeChange"; "width": "widthChange"; "buffer": "bufferChange"; "circleSize": "circleSizeChange"; }, never, never, true, never>;
}
