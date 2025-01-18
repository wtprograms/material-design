export class Time {
  get totalSeconds() {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }

  constructor(
    public readonly hours = 0,
    public readonly minutes = 0,
    public readonly seconds = 0
  ) {}

  static fromTotalSeconds(totalSeconds: number) {
    let seconds = totalSeconds;
    let minutes = 0;
    let hours = 0;
    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      seconds = totalSeconds % 60;
    }
    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    return new Time(hours, minutes, seconds);
  }
}
