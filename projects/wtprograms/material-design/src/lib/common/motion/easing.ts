export const EASING = {
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  legacy: 'cubic-bezier(0.4, 0, 0.2, 1)',
  legacyAccelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  legacyDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  linear: 'cubic-bezier(0, 0, 1, 1)',
};

export type Easing = keyof typeof EASING;

export function easingToFunction(easing?: Easing | string): string | undefined {
  if (!easing) {
    return undefined;
  }
  if (easing in EASING) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (EASING as any)[easing];
  }
  return easing;
}