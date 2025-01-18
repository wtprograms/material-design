export function pxToRem(px: number): number {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return px / fontSize;
}