export declare class TimeSpan {
    private _hours;
    private _minutes;
    private _seconds;
    constructor(hours?: number, minutes?: number, seconds?: number);
    private normalize;
    set hours(value: number);
    get hours(): number;
    set minutes(value: number);
    get minutes(): number;
    set seconds(value: number);
    get seconds(): number;
    get totalSeconds(): number;
    toString(options?: TimeSpanFormattingOptions): string;
    static parse(timeString: string): TimeSpan;
    static fromSeconds(seconds: number): TimeSpan;
    static fromDate(date: Date): TimeSpan;
    compare(other: TimeSpan): 0 | 1 | -1;
    min(other: TimeSpan): TimeSpan;
    max(other: TimeSpan): TimeSpan;
}
export interface TimeSpanFormattingOptions {
    hours?: boolean;
    seconds?: boolean;
}
