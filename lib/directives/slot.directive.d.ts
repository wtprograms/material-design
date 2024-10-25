import { Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';
import * as i0 from "@angular/core";
export type Slots = 'leading' | 'trailing' | 'icon' | 'selected-value' | 'headline' | 'supporting-text' | 'action' | 'counter' | 'unchecked-icon' | 'checked-icon' | 'prefix' | 'suffix' | 'item' | 'label' | string;
export declare class SlotDirective {
    readonly name: import("@angular/core").InputSignal<string | undefined>;
    readonly slot: import("@angular/core").InputSignal<string | undefined>;
    private readonly _hostElement;
    private readonly _platformId;
    private get _assignedNodes();
    readonly assignedNodes$: BehaviorSubject<Node[]>;
    readonly nodes: import("@angular/core").Signal<Node[]>;
    readonly length: import("@angular/core").Signal<number>;
    readonly any: import("@angular/core").Signal<boolean>;
    readonly elements: import("@angular/core").Signal<HTMLElement[]>;
    readonly components: import("@angular/core").Signal<any[]>;
    elementsOf<T extends HTMLElement>(...types: Type<T>[]): T[];
    componentsOf<T extends MaterialDesignComponent>(...types: Type<T>[]): T[];
    onSlotChange(): void;
    private filterType;
    static ɵfac: i0.ɵɵFactoryDeclaration<SlotDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SlotDirective, "slot", never, { "name": { "alias": "name"; "required": false; "isSignal": true; }; "slot": { "alias": "slot"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
