export class TimeSpan {
  private _hours: number;
  private _minutes: number;
  private _seconds: number;

  constructor(hours: number = 0, minutes: number = 0, seconds: number = 0) {
    this._hours = hours;
    this._minutes = minutes;
    this._seconds = seconds;
    this.normalize();
  }

  private normalize(): void {
    if (this._seconds >= 60) {
      this._minutes += Math.floor(this._seconds / 60);
      this._seconds = this._seconds % 60;
    }

    if (this._minutes >= 60) {
      this._hours += Math.floor(this._minutes / 60);
      this._minutes = this._minutes % 60;
    }
  }

  set hours(value: number) {
    this._hours = value;
    this.normalize();
  }

  get hours(): number {
    return this._hours;
  }

  set minutes(value: number) {
    this._minutes = value;
    this.normalize();
  }

  get minutes(): number {
    return this._minutes;
  }

  set seconds(value: number) {
    this._seconds = value;
    this.normalize();
  }

  get seconds(): number {
    return this._seconds;
  }

  get totalSeconds(): number {
    return this._hours * 3600 + this._minutes * 60 + this._seconds;
  }

  toString(): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(this._hours)}:${pad(this._minutes)}:${pad(this._seconds)}`;
  }

  static parse(timeString: string): TimeSpan {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return new TimeSpan(hours, minutes, seconds);
  }

  static fromSeconds(seconds: number): TimeSpan {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return new TimeSpan(hours, minutes, remainingSeconds);
  }
}
