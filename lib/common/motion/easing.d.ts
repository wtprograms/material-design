export declare const EASING: {
    emphasized: string;
    emphasizedAccelerate: string;
    emphasizedDecelerate: string;
    standard: string;
    standardAccelerate: string;
    standardDecelerate: string;
    legacy: string;
    legacyAccelerate: string;
    legacyDecelerate: string;
    linear: string;
};
export type Easing = keyof typeof EASING;
export declare function easingToFunction(easing?: Easing | string): string | undefined;
