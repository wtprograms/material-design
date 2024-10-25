import { Pipe } from '@angular/core';
import { getDateTimeFormatOptions } from '../common/date-helpers/get-date-time-format-options';
import * as i0 from "@angular/core";
export class DateFormatPipe {
    transform(value, locale, format) {
        return dateFormat(locale, value, format);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DateFormatPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.9", ngImport: i0, type: DateFormatPipe, isStandalone: true, name: "dateFormat" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DateFormatPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'dateFormat',
                    pure: true,
                    standalone: true,
                }]
        }] });
export function dateFormat(locale, value, format) {
    if (!value) {
        return '';
    }
    return value.toLocaleDateString(locale, getDateTimeFormatOptions(format));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1mb3JtYXQucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvcGlwZXMvZGF0ZS1mb3JtYXQucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQzs7QUFPL0YsTUFBTSxPQUFPLGNBQWM7SUFDekIsU0FBUyxDQUFDLEtBQXVCLEVBQUUsTUFBYyxFQUFFLE1BQWM7UUFDL0QsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDO3VHQUhVLGNBQWM7cUdBQWQsY0FBYzs7MkZBQWQsY0FBYztrQkFMMUIsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsWUFBWTtvQkFDbEIsSUFBSSxFQUFFLElBQUk7b0JBQ1YsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOztBQU9ELE1BQU0sVUFBVSxVQUFVLENBQ3hCLE1BQWMsRUFDZCxLQUF1QixFQUN2QixNQUFjO0lBRWQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1gsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsT0FBTyxLQUFLLENBQUMsa0JBQWtCLENBQzdCLE1BQU0sRUFDTix3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FDakMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBnZXREYXRlVGltZUZvcm1hdE9wdGlvbnMgfSBmcm9tICcuLi9jb21tb24vZGF0ZS1oZWxwZXJzL2dldC1kYXRlLXRpbWUtZm9ybWF0LW9wdGlvbnMnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdkYXRlRm9ybWF0JyxcbiAgcHVyZTogdHJ1ZSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgRGF0ZUZvcm1hdFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBEYXRlIHwgdW5kZWZpbmVkLCBsb2NhbGU6IHN0cmluZywgZm9ybWF0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gZGF0ZUZvcm1hdChsb2NhbGUsIHZhbHVlLCBmb3JtYXQpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRlRm9ybWF0KFxuICBsb2NhbGU6IHN0cmluZyxcbiAgdmFsdWU6IERhdGUgfCB1bmRlZmluZWQsXG4gIGZvcm1hdDogc3RyaW5nXG4pIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gdmFsdWUudG9Mb2NhbGVEYXRlU3RyaW5nKFxuICAgIGxvY2FsZSxcbiAgICBnZXREYXRlVGltZUZvcm1hdE9wdGlvbnMoZm9ybWF0KVxuICApO1xufVxuIl19