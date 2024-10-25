export class TimeSpan {
  private _hours: number;
  private _minutes: number;
  private _seconds: number;

  constructor(hours?: number, minutes?: number, seconds?: number) {
    this._hours = hours ?? 0;
    this._minutes = minutes ?? 0;
    this._seconds = seconds ?? 0;
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

  toString(options?: TimeSpanFormattingOptions): string {
    options ??= {
      hours: true,
      seconds: true,
    };
    const hours = options?.hours ? `${this.hours}:` : '';
    const seconds = options?.seconds ? `:${this.seconds}` : '';
    return `${hours}${this.minutes}${seconds}`;
  }

  static parse(timeString: string): TimeSpan {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return new TimeSpan(hours ?? 0, minutes ?? 0, seconds ?? 0);
  }

  static fromSeconds(seconds: number): TimeSpan {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return new TimeSpan(hours, minutes, remainingSeconds);
  }

  static fromDate(date: Date) {
    return new TimeSpan(date.getHours(), date.getMinutes(), date.getSeconds());
  }

  compare(other: TimeSpan) {
    if (this.totalSeconds < other.totalSeconds) {
      return -1;
    } else if (this.totalSeconds > other.totalSeconds) {
      return 1;
    }
    return 0;
  }

  min(other: TimeSpan): TimeSpan {
    return this.compare(other) < 0 ? this : other;
  }

  max(other: TimeSpan): TimeSpan {
    return this.compare(other) > 0 ? this : other;
  }
}

export interface TimeSpanFormattingOptions {
  hours?: boolean;
  seconds?: boolean;
}