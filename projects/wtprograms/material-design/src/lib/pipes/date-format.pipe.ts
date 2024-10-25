import { Pipe, PipeTransform } from '@angular/core';
import { getDateTimeFormatOptions } from '../common/date-helpers/get-date-time-format-options';

@Pipe({
  name: 'dateFormat',
  pure: true,
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | undefined, locale: string, format: string) {
    return dateFormat(locale, value, format);
  }
}

export function dateFormat(
  locale: string,
  value: Date | undefined,
  format: string
) {
  if (!value) {
    return '';
  }
  return value.toLocaleDateString(
    locale,
    getDateTimeFormatOptions(format)
  );
}
