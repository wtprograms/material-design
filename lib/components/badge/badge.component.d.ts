import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
export declare class BadgeComponent extends MaterialDesignComponent {
    readonly dot: import("@angular/core").ModelSignal<boolean>;
    readonly number: import("@angular/core").ModelSignal<number | undefined>;
    readonly embedded: import("@angular/core").ModelSignal<boolean>;
    readonly text: import("@angular/core").Signal<number | "999+" | undefined>;
    readonly singleDigit: import("@angular/core").Signal<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BadgeComponent, "md-badge", never, { "dot": { "alias": "dot"; "required": false; "isSignal": true; }; "number": { "alias": "number"; "required": false; "isSignal": true; }; "embedded": { "alias": "embedded"; "required": false; "isSignal": true; }; }, { "dot": "dotChange"; "number": "numberChange"; "embedded": "embeddedChange"; }, never, never, true, never>;
}
