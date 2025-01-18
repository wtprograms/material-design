export function remToPx(rem: number): number {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * fontSize;
}