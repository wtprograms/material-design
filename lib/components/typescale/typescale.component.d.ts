import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
export type Typescale = 'display' | 'headline' | 'body' | 'title' | 'label';
export type TypescaleSize = 'large' | 'medium' | 'small';
export declare class TypescaleComponent extends MaterialDesignComponent {
    readonly scale: import("@angular/core").ModelSignal<Typescale>;
    readonly size: import("@angular/core").ModelSignal<TypescaleSize>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TypescaleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TypescaleComponent, "md-typescale", never, { "scale": { "alias": "scale"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; }, { "scale": "scaleChange"; "size": "sizeChange"; }, never, never, true, never>;
}
