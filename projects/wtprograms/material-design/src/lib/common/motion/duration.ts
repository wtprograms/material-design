export const DURATION = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
};

export type Duration = keyof typeof DURATION;

export function durationToMilliseconds(duration?: Duration | number): number | undefined {
  if (!duration) {
    return undefined;
  }
  if (typeof duration === 'number') {
    return duration;
  }
  return DURATION[duration];
}