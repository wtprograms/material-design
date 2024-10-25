import { ChangeDetectorRef, Directive, inject, } from '@angular/core';
import { MaterialDesignValueAccessorComponent } from '../components/material-design-value-accessor.component';
import { FormGroupDirective } from '@angular/forms';
import * as i0 from "@angular/core";
export class FormGroupResetterDirective {
    _formGroup = inject(FormGroupDirective);
    _changeDetectorRef = inject(ChangeDetectorRef);
    ngAfterViewInit() {
        this._formGroup.statusChanges?.subscribe(() => this._changeDetectorRef.detectChanges());
        const resetPrevious = this._formGroup.form.reset.bind(this._formGroup.form);
        this._formGroup.form.reset = (value) => {
            resetPrevious.call(this._formGroup, value);
            for (const directive of this._formGroup.directives) {
                if (directive.valueAccessor instanceof
                    MaterialDesignValueAccessorComponent) {
                    directive.control.markAsPristine();
                    directive.control.markAsUntouched();
                    directive.valueAccessor.errorText.set(undefined);
                }
            }
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FormGroupResetterDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.9", type: FormGroupResetterDirective, isStandalone: true, selector: "[formGroup]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FormGroupResetterDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[formGroup]',
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC1yZXNldHRlci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2RpcmVjdGl2ZXMvZm9ybS1ncm91cC1yZXNldHRlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQzlHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQU9wRCxNQUFNLE9BQU8sMEJBQTBCO0lBQ3BCLFVBQVUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4QyxrQkFBa0IsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUVoRSxlQUFlO1FBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUM1QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQ3hDLENBQUM7UUFDRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBZSxFQUFFLEVBQUU7WUFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzNDLEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbkQsSUFDRSxTQUFTLENBQUMsYUFBYTtvQkFDdkIsb0NBQW9DLEVBQ3BDLENBQUM7b0JBQ0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDbkMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDcEMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQztJQUNKLENBQUM7dUdBdEJVLDBCQUEwQjsyRkFBMUIsMEJBQTBCOzsyRkFBMUIsMEJBQTBCO2tCQUx0QyxTQUFTO21CQUFDO29CQUNULDhEQUE4RDtvQkFDOUQsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIGluamVjdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnblZhbHVlQWNjZXNzb3JDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL21hdGVyaWFsLWRlc2lnbi12YWx1ZS1hY2Nlc3Nvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRm9ybUdyb3VwRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdbZm9ybUdyb3VwXScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cFJlc2V0dGVyRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Zvcm1Hcm91cCA9IGluamVjdChGb3JtR3JvdXBEaXJlY3RpdmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jaGFuZ2VEZXRlY3RvclJlZiA9IGluamVjdChDaGFuZ2VEZXRlY3RvclJlZik7XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2Zvcm1Hcm91cC5zdGF0dXNDaGFuZ2VzPy5zdWJzY3JpYmUoKCkgPT5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKVxuICAgICk7XG4gICAgY29uc3QgcmVzZXRQcmV2aW91cyA9IHRoaXMuX2Zvcm1Hcm91cC5mb3JtLnJlc2V0LmJpbmQodGhpcy5fZm9ybUdyb3VwLmZvcm0pO1xuICAgIHRoaXMuX2Zvcm1Hcm91cC5mb3JtLnJlc2V0ID0gKHZhbHVlPzogdW5rbm93bikgPT4ge1xuICAgICAgcmVzZXRQcmV2aW91cy5jYWxsKHRoaXMuX2Zvcm1Hcm91cCwgdmFsdWUpO1xuICAgICAgZm9yIChjb25zdCBkaXJlY3RpdmUgb2YgdGhpcy5fZm9ybUdyb3VwLmRpcmVjdGl2ZXMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGRpcmVjdGl2ZS52YWx1ZUFjY2Vzc29yIGluc3RhbmNlb2ZcbiAgICAgICAgICBNYXRlcmlhbERlc2lnblZhbHVlQWNjZXNzb3JDb21wb25lbnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgZGlyZWN0aXZlLmNvbnRyb2wubWFya0FzUHJpc3RpbmUoKTtcbiAgICAgICAgICBkaXJlY3RpdmUuY29udHJvbC5tYXJrQXNVbnRvdWNoZWQoKTtcbiAgICAgICAgICBkaXJlY3RpdmUudmFsdWVBY2Nlc3Nvci5lcnJvclRleHQuc2V0KHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=