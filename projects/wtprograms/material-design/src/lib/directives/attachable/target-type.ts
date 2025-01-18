import { Signal, ElementRef } from '@angular/core';
import { TargetTypeWithoutSignal } from './target-type-without-signal';

export type TargetType =
  | TargetTypeWithoutSignal
  | Signal<ElementRef<HTMLElement> | undefined>
  | Signal<HTMLElement>;