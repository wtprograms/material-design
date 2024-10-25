export function getMeridianValues(locale: string) {
  const date = new Date(2000, 0, 1);
  const am = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true }).split(' ')[1];
  date.setHours(13);
  const pm = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true }).split(' ')[1];
  return {
    am,
    pm,
  };
}