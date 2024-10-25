import { Component, effect, HostListener, inject, model, } from '@angular/core';
import { MaterialDesignComponent } from './material-design.component';
import { FormGroupDirective, } from '@angular/forms';
import { GET_VALIDATION_MESSAGE_INJECTION_TOKEN } from '../configuration/get-validation-message.injection-token';
import * as i0 from "@angular/core";
export class MaterialDesignValueAccessorComponent extends MaterialDesignComponent {
    disabled = model(false);
    errorText = model();
    _onChange;
    _onTouched;
    _control;
    _previousValue;
    _formGroup = inject(FormGroupDirective, { optional: true });
    _getValidationMessage = inject(GET_VALIDATION_MESSAGE_INJECTION_TOKEN);
    get formControlName() {
        return this.hostElement.getAttribute('formControlName');
    }
    get control() {
        if (!this._formGroup || !this.formControlName) {
            return undefined;
        }
        if (this._control) {
            return this._control;
        }
        this._control = this._formGroup.control.get(this.formControlName);
        this._control.valueChanges.subscribe(() => this.invalidate());
        this._control.statusChanges.subscribe(() => this.invalidate());
        return this._control;
    }
    constructor() {
        super();
        effect(() => {
            if (this._previousValue !== this.value()) {
                this._previousValue = this.value();
                this._onChange?.(this.value());
            }
        });
    }
    writeValue(value) {
        this.value.set(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled.set(isDisabled);
    }
    onFocus() {
        this._onTouched?.();
        this.invalidate();
    }
    invalidate() {
        if (!this.control) {
            return;
        }
        const errors = [];
        for (const key in this.control.errors) {
            const properties = this.control.errors[key];
            const message = this._getValidationMessage(key, properties);
            if (message) {
                errors.push(message);
            }
        }
        this.errorText.set(errors[0] ?? undefined);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MaterialDesignValueAccessorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: MaterialDesignValueAccessorComponent, selector: "ng-component", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, errorText: { classPropertyName: "errorText", publicName: "errorText", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { disabled: "disabledChange", errorText: "errorTextChange" }, host: { listeners: { "focus": "onFocus()" } }, usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MaterialDesignValueAccessorComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                }]
        }], ctorParameters: () => [], propDecorators: { onFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZGVzaWduLXZhbHVlLWFjY2Vzc29yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9tYXRlcmlhbC1kZXNpZ24tdmFsdWUtYWNjZXNzb3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxHQUVOLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFHTCxrQkFBa0IsR0FDbkIsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSx5REFBeUQsQ0FBQzs7QUFLakgsTUFBTSxPQUFnQixvQ0FJcEIsU0FBUSx1QkFBaUM7SUFHaEMsUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixTQUFTLEdBQUcsS0FBSyxFQUFVLENBQUM7SUFHN0IsU0FBUyxDQUF1QztJQUNoRCxVQUFVLENBQWM7SUFDeEIsUUFBUSxDQUFlO0lBQ3ZCLGNBQWMsQ0FBVTtJQUVmLFVBQVUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1RCxxQkFBcUIsR0FBRyxNQUFNLENBQzdDLHNDQUFzQyxDQUN2QyxDQUFDO0lBRUYsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDOUMsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQ3pDLElBQUksQ0FBQyxlQUFlLENBQ04sQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQ7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFhO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUF1QztRQUN0RCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBYztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUdELE9BQU87UUFDTCxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xCLE9BQU87UUFDVCxDQUFDO1FBQ0QsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN0QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDO1FBQ0gsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQztJQUM3QyxDQUFDO3VHQXJGbUIsb0NBQW9DOzJGQUFwQyxvQ0FBb0Msa2RBRjlDLEVBQUU7OzJGQUVRLG9DQUFvQztrQkFIekQsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsRUFBRTtpQkFDYjt3REFvRUMsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIGVmZmVjdCxcbiAgSG9zdExpc3RlbmVyLFxuICBpbmplY3QsXG4gIG1vZGVsLFxuICBNb2RlbFNpZ25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnbkNvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtZGVzaWduLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgRm9ybUNvbnRyb2wsXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgR0VUX1ZBTElEQVRJT05fTUVTU0FHRV9JTkpFQ1RJT05fVE9LRU4gfSBmcm9tICcuLi9jb25maWd1cmF0aW9uL2dldC12YWxpZGF0aW9uLW1lc3NhZ2UuaW5qZWN0aW9uLXRva2VuJztcblxuQENvbXBvbmVudCh7XG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0ZXJpYWxEZXNpZ25WYWx1ZUFjY2Vzc29yQ29tcG9uZW50PFxuICAgIFRWYWx1ZSxcbiAgICBURWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnRcbiAgPlxuICBleHRlbmRzIE1hdGVyaWFsRGVzaWduQ29tcG9uZW50PFRFbGVtZW50PlxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG57XG4gIHJlYWRvbmx5IGRpc2FibGVkID0gbW9kZWwoZmFsc2UpO1xuICByZWFkb25seSBlcnJvclRleHQgPSBtb2RlbDxzdHJpbmc+KCk7XG4gIGFic3RyYWN0IHZhbHVlOiBNb2RlbFNpZ25hbDxUVmFsdWUgfCB1bmRlZmluZWQ+O1xuXG4gIHByaXZhdGUgX29uQ2hhbmdlPzogKHZhbHVlOiBUVmFsdWUgfCB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIHByaXZhdGUgX29uVG91Y2hlZD86ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX2NvbnRyb2w/OiBGb3JtQ29udHJvbDtcbiAgcHJpdmF0ZSBfcHJldmlvdXNWYWx1ZT86IFRWYWx1ZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9mb3JtR3JvdXAgPSBpbmplY3QoRm9ybUdyb3VwRGlyZWN0aXZlLCB7IG9wdGlvbmFsOiB0cnVlIH0pO1xuICBwcml2YXRlIHJlYWRvbmx5IF9nZXRWYWxpZGF0aW9uTWVzc2FnZSA9IGluamVjdChcbiAgICBHRVRfVkFMSURBVElPTl9NRVNTQUdFX0lOSkVDVElPTl9UT0tFTlxuICApO1xuXG4gIGdldCBmb3JtQ29udHJvbE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaG9zdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmb3JtQ29udHJvbE5hbWUnKTtcbiAgfVxuXG4gIGdldCBjb250cm9sKCkge1xuICAgIGlmICghdGhpcy5fZm9ybUdyb3VwIHx8ICF0aGlzLmZvcm1Db250cm9sTmFtZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb250cm9sO1xuICAgIH1cbiAgICB0aGlzLl9jb250cm9sID0gdGhpcy5fZm9ybUdyb3VwLmNvbnRyb2wuZ2V0KFxuICAgICAgdGhpcy5mb3JtQ29udHJvbE5hbWVcbiAgICApIGFzIEZvcm1Db250cm9sO1xuICAgIHRoaXMuX2NvbnRyb2wudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLmludmFsaWRhdGUoKSk7XG4gICAgdGhpcy5fY29udHJvbC5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLmludmFsaWRhdGUoKSk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRyb2w7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNWYWx1ZSAhPT0gdGhpcy52YWx1ZSgpKSB7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzVmFsdWUgPSB0aGlzLnZhbHVlKCk7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlPy4odGhpcy52YWx1ZSgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IFRWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUuc2V0KHZhbHVlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogVFZhbHVlIHwgdW5kZWZpbmVkKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkLnNldChpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJylcbiAgb25Gb2N1cygpIHtcbiAgICB0aGlzLl9vblRvdWNoZWQ/LigpO1xuICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICB9XG5cbiAgaW52YWxpZGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMuY29udHJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5jb250cm9sLmVycm9ycykge1xuICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMuY29udHJvbC5lcnJvcnNba2V5XTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9nZXRWYWxpZGF0aW9uTWVzc2FnZShrZXksIHByb3BlcnRpZXMpO1xuICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JzLnB1c2gobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZXJyb3JUZXh0LnNldChlcnJvcnNbMF0gPz8gdW5kZWZpbmVkKTtcbiAgfVxufVxuIl19