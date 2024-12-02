import { Directive, input } from '@angular/core';
import { ProgressIndicatorVariant } from './progress-indicator.component';

@Directive()
export class MdProgressIndicatorUserDirective {
  readonly progressVariant = input<ProgressIndicatorVariant>('circular');
  readonly progressValue = input(0);
  readonly progressMax = input(1);
  readonly progressIndeterminate = input(false);
  readonly progressFourColor = input(false);
  readonly progressSize = input<number>();
  readonly progressWidth = input<number>();
  readonly progressBuffer = input(0);
}