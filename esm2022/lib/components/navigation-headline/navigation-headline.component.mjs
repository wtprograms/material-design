import { ChangeDetectionStrategy, Component, ViewEncapsulation, } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
export class NavigationHeadlineComponent extends MaterialDesignComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationHeadlineComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.9", type: NavigationHeadlineComponent, isStandalone: true, selector: "md-navigation-headline", usesInheritance: true, ngImport: i0, template: "<slot></slot>", styles: [":host{display:inline-flex;height:56px;align-items:center;margin-inline-start:16px;font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationHeadlineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-navigation-headline', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [], hostDirectives: [], host: {}, template: "<slot></slot>", styles: [":host{display:inline-flex;height:56px;align-items:center;margin-inline-start:16px;font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}\n"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi1oZWFkbGluZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2NvbXBvbmVudHMvbmF2aWdhdGlvbi1oZWFkbGluZS9uYXZpZ2F0aW9uLWhlYWRsaW5lLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tcG9uZW50cy9uYXZpZ2F0aW9uLWhlYWRsaW5lL25hdmlnYXRpb24taGVhZGxpbmUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDOztBQWF2RSxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsdUJBQXVCO3VHQUEzRCwyQkFBMkI7MkZBQTNCLDJCQUEyQix5R0NsQnhDLGVBQWE7OzJGRGtCQSwyQkFBMkI7a0JBWHZDLFNBQVM7K0JBQ0Usd0JBQXdCLGNBR3RCLElBQUksbUJBQ0MsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsU0FBUyxXQUNqQyxFQUFFLGtCQUNLLEVBQUUsUUFDWixFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0ZXJpYWxEZXNpZ25Db21wb25lbnQgfSBmcm9tICcuLi9tYXRlcmlhbC1kZXNpZ24uY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWQtbmF2aWdhdGlvbi1oZWFkbGluZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uYXZpZ2F0aW9uLWhlYWRsaW5lLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL25hdmlnYXRpb24taGVhZGxpbmUuY29tcG9uZW50LnNjc3MnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tLFxuICBpbXBvcnRzOiBbXSxcbiAgaG9zdERpcmVjdGl2ZXM6IFtdLFxuICBob3N0OiB7fSxcbn0pXG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvbkhlYWRsaW5lQ29tcG9uZW50IGV4dGVuZHMgTWF0ZXJpYWxEZXNpZ25Db21wb25lbnQge31cbiIsIjxzbG90Pjwvc2xvdD4iXX0=