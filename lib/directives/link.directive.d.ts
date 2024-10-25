import { OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class LinkDirective implements OnDestroy {
    readonly mdLink: import("@angular/core").InputSignal<unknown>;
    readonly mdLinkActiveClass: import("@angular/core").InputSignal<string | undefined>;
    readonly mdLinkExact: import("@angular/core").InputSignal<boolean>;
    readonly mdLinkSelectable: import("@angular/core").InputSignal<boolean | "">;
    readonly mdLinkOutlet: import("@angular/core").InputSignal<string | undefined>;
    private readonly _router;
    private readonly _activatedRoute;
    readonly href: import("@angular/core").Signal<string | undefined>;
    readonly urlTree: import("@angular/core").Signal<import("@angular/router").UrlTree>;
    private readonly _element;
    private readonly _component;
    private _subscription?;
    constructor();
    ngOnDestroy(): void;
    onClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LinkDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<LinkDirective, "[mdLink]", never, { "mdLink": { "alias": "mdLink"; "required": true; "isSignal": true; }; "mdLinkActiveClass": { "alias": "mdLinkActiveClass"; "required": false; "isSignal": true; }; "mdLinkExact": { "alias": "mdLinkExact"; "required": false; "isSignal": true; }; "mdLinkSelectable": { "alias": "mdLinkSelectable"; "required": false; "isSignal": true; }; "mdLinkOutlet": { "alias": "mdLinkOutlet"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
