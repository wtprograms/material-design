export const SCREENS_SIZE = {
  extraSmall: 0,
  small: 640,
  medium: 768,
  large: 1024,
  extraLarge: 1280,
  large2x: 1536,
  large3x: 1920,
  large4x: 2560,
  large5x: 3840,
};

export type ScreenSize = keyof typeof SCREENS_SIZE;

export function screenToSize(screen?: ScreenSize | number): number | undefined {
  if (!screen) {
    return undefined;
  }
  if (typeof screen === 'number') {
    return screen;
  }
  return SCREENS_SIZE[screen];
}

export function screenToString(screen?: ScreenSize | number) {
  const px = screenToSize(screen) ?? 0;
  return `${px}px`;
}