/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core';

const handlers: Record<string, any> = {
  required: () => $localize`This field is required.`,
  minlength: ({ requiredLength, actualLength }: any) =>
    $localize`This field must be at least ${requiredLength} characters`,
  maxlength: ({ requiredLength, actualLength }: any) =>
    $localize`This field must be at most ${requiredLength} characters`,
  min: ({ min }: any) => $localize`This field must be at least ${min}`,
  max: ({ max }: any) => $localize`This field must be at most ${max}`,
  pattern: ({ requiredPattern, actualValue }: any) =>
    $localize`This field must match the pattern: ${requiredPattern}`,
  email: () => $localize`This field must be a valid email address.`,
  nullValidator: () => null,
};

export const GET_VALIDATION_MESSAGE_INJECTION_TOKEN = new InjectionToken<
  (key: string, properties?: Record<string, any>) => string
>('GET_VALIDATION_MESSAGE_INJECTION_TOKEN', {
  providedIn: 'root',
  factory: () => (messageOrKey: string, properties?: Record<string, any>) => {
    if (handlers[messageOrKey]) {
      return handlers[messageOrKey](properties ?? {});
    }
    return undefined;
  },
});
