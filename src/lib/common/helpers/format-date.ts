export function getDateTimeFormatOptions(format: string): Intl.DateTimeFormatOptions {
  const options: Intl.DateTimeFormatOptions = {};

  const formatParts = format.split(/[\s/.-]+/);
  formatParts.forEach(part => {
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
      default:
        break;
    }
  });

  return options;
}