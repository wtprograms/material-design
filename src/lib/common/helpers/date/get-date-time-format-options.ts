export function getDateTimeFormatOptions(
  format: string
): Intl.DateTimeFormatOptions {
  const options: Intl.DateTimeFormatOptions = {};

  const formatParts = format.replace(':', ' ').split(/[\s/.-]+/);
  for (const part of formatParts) {
    switch (part) {
      case 'dd':
        options.day = '2-digit';
        break;
      case 'd':
        options.day = 'numeric';
        break;
      case 'MM':
        options.month = '2-digit';
        break;
      case 'M':
        options.month = 'numeric';
        break;
      case 'MMM':
        options.month = 'short';
        break;
      case 'MMMM':
        options.month = 'long';
        break;
      case 'yy':
        options.year = '2-digit';
        break;
      case 'yyyy':
        options.year = 'numeric';
        break;
      case 'HH':
        options.hour = '2-digit';
        options.hour12 = false;
        break;
      case 'H':
        options.hour = 'numeric';
        options.hour12 = false;
        break;
      case 'hh':
        options.hour = '2-digit';
        options.hour12 = true;
        break;
      case 'h':
        options.hour = 'numeric';
        options.hour12 = true;
        break;
      case 'mm':
        options.minute = '2-digit';
        break;
      case 'm':
        options.minute = 'numeric';
        break;
      case 'ss':
        options.second = '2-digit';
        break;
      case 's':
        options.second = 'numeric';
        break;
      case 'a':
      case 'A':
        options.hour12 = true;
        break;
      default:
        break;
    }
  }

  return options;
}
