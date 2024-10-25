import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DateFormatPipe implements PipeTransform {
    transform(value: Date | undefined, locale: string, format: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateFormatPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<DateFormatPipe, "dateFormat", true>;
}
export declare function dateFormat(locale: string, value: Date | undefined, format: string): string;
