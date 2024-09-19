export function getMeridianValues(locale: string) {
  const date = Date.getToday();
  const am = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true }).split(' ')[1];
  date.setHours(13);
  const pm = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true }).split(' ')[1];
  return {
    am,
    pm,
  };
}