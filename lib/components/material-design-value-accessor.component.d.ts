import { ModelSignal } from '@angular/core';
import { MaterialDesignComponent } from './material-design.component';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import * as i0 from "@angular/core";
export declare abstract class MaterialDesignValueAccessorComponent<TValue, TElement extends HTMLElement = HTMLElement> extends MaterialDesignComponent<TElement> implements ControlValueAccessor {
    readonly disabled: ModelSignal<boolean>;
    readonly errorText: ModelSignal<string | undefined>;
    abstract value: ModelSignal<TValue | undefined>;
    private _onChange?;
    private _onTouched?;
    private _control?;
    private _previousValue?;
    private readonly _formGroup;
    private readonly _getValidationMessage;
    get formControlName(): string | null;
    get control(): FormControl<any> | undefined;
    constructor();
    writeValue(value: TValue): void;
    registerOnChange(fn: (value: TValue | undefined) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    onFocus(): void;
    invalidate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaterialDesignValueAccessorComponent<any, any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MaterialDesignValueAccessorComponent<any, any>, "ng-component", never, { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "errorText": { "alias": "errorText"; "required": false; "isSignal": true; }; }, { "disabled": "disabledChange"; "errorText": "errorTextChange"; }, never, never, false, never>;
}
