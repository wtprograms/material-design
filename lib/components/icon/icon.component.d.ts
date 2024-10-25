import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
export declare class IconComponent extends MaterialDesignComponent {
    readonly filled: import("@angular/core").ModelSignal<boolean>;
    readonly size: import("@angular/core").ModelSignal<number | undefined>;
    readonly badgeDot: import("@angular/core").ModelSignal<boolean>;
    readonly badgeNumber: import("@angular/core").ModelSignal<number | undefined>;
    readonly slot: import("@angular/core").ModelSignal<string | undefined>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IconComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IconComponent, "md-icon", never, { "filled": { "alias": "filled"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "badgeDot": { "alias": "badgeDot"; "required": false; "isSignal": true; }; "badgeNumber": { "alias": "badgeNumber"; "required": false; "isSignal": true; }; "slot": { "alias": "slot"; "required": false; "isSignal": true; }; }, { "filled": "filledChange"; "size": "sizeChange"; "badgeDot": "badgeDotChange"; "badgeNumber": "badgeNumberChange"; "slot": "slotChange"; }, never, never, true, never>;
}
