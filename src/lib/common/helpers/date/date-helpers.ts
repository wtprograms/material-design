import { getDateTimeFormatOptions } from './get-date-time-format-options';

declare global {
  interface DateConstructor {
    parseString<T extends Date | undefined>(
      value: string | undefined | null,
      defaultValue?: T
    ): T extends Date ? Date : Date | undefined | null;
    getToday(): Date;
  }

  interface Date {
    isDateEqual(date?: Date): boolean;
    isToday(): boolean;
    toFormattedDateString(locale: string, format?: string): string;
    toFormattedTimeString(locale: string, format?: string): string;
    isInRange(min?: string | null, max?: string | null): boolean;
  }
}

Date.parseString = function <T extends Date | undefined>(
  value: string | undefined | null,
  defaultValue?: T
): T extends Date ? Date : Date | undefined | null {
  if (value) {
    const parsedDate = new Date(value);
    return parsedDate as T extends Date ? Date : Date | undefined | null;
  }
  return defaultValue as T extends Date ? Date : Date | undefined | null;
}

Date.getToday = function (): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

Date.prototype.isDateEqual = function (date?: Date) {
  if (!date) {
    return false;
  }
  return (
    this.getFullYear() === date.getFullYear() &&
    this.getMonth() === date.getMonth() &&
    this.getDate() === date.getDate()
  );
};

Date.prototype.isToday = function () {
  const today = new Date();
  return this.isDateEqual(today);
};

Date.prototype.toFormattedDateString = function (locale: string, format?: string) {
  const options = format ? getDateTimeFormatOptions(format) : {};
  return this.toLocaleDateString(locale, options);
};

Date.prototype.toFormattedTimeString = function (locale: string, format?: string) {
  const options = format ? getDateTimeFormatOptions(format) : {};
  return this.toLocaleTimeString(locale, options);
};

Date.prototype.isInRange = function (min?: string | null, max?: string | null): boolean {
  const minDate = Date.parseString(min);
  const maxDate = Date.parseString(max);

  if (minDate && this < minDate) {
    return false;
  }

  if (maxDate && this > maxDate) {
    return false;
  }

  return true;
}