import { OnDestroy, OnInit, Signal, Type } from '@angular/core';
import { SlotDirective } from '../directives/slot.directive';
import * as i0 from "@angular/core";
export declare abstract class MaterialDesignComponent<T extends HTMLElement = HTMLElement> implements OnInit, OnDestroy {
    readonly slots: Signal<readonly SlotDirective[]>;
    readonly platformId: Object;
    readonly hostElement: T;
    readonly defaultSlot: Signal<SlotDirective | undefined>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    slotDirective(name?: string): Signal<SlotDirective | undefined>;
    setSlots<T extends MaterialDesignComponent>(types: Type<T>[] | Type<T>, callback: (component: T) => void, ...signals: Signal<unknown>[]): void;
    static get<T extends MaterialDesignComponent = any>(element: any): T | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaterialDesignComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MaterialDesignComponent<any>, "ng-component", never, {}, {}, never, never, false, never>;
}
