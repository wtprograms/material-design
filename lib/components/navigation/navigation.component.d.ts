import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
export type NavigationLayout = 'drawer' | 'rail' | 'bar';
export declare class NavigationComponent extends MaterialDesignComponent {
    readonly layout: import("@angular/core").ModelSignal<NavigationLayout>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<NavigationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NavigationComponent, "md-navigation", never, { "layout": { "alias": "layout"; "required": false; "isSignal": true; }; }, { "layout": "layoutChange"; }, never, never, true, never>;
}
