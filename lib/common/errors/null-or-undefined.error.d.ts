export declare class NullOrUndefinedError extends Error {
    readonly value: unknown;
    constructor(value: unknown, message?: string);
}
