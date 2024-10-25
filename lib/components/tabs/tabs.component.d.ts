import { MaterialDesignComponent } from '../material-design.component';
import { TabComponent } from '../tab/tab.component';
import * as i0 from "@angular/core";
export declare class TabsComponent extends MaterialDesignComponent {
    readonly secondary: import("@angular/core").ModelSignal<boolean>;
    readonly selectedTab$: import("rxjs").Observable<TabComponent>;
    readonly selectedTab: import("@angular/core").Signal<TabComponent | undefined>;
    readonly indicatorStyle: import("@angular/core").Signal<Partial<CSSStyleDeclaration>>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<TabsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabsComponent, "md-tabs", never, { "secondary": { "alias": "secondary"; "required": false; "isSignal": true; }; }, { "secondary": "secondaryChange"; }, never, never, true, never>;
}
