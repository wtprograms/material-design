import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
export declare class AccordianComponent extends MaterialDesignComponent {
    readonly open: import("@angular/core").ModelSignal<boolean>;
    private readonly _openClose$;
    readonly state: import("@angular/core").Signal<import("../../common/rxjs/open-close").OpenCloseState | undefined>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordianComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AccordianComponent, "md-accordian", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; }, { "open": "openChange"; }, never, never, true, never>;
}
