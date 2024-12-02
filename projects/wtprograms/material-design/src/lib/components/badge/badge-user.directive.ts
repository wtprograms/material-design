import { Directive, input, model } from '@angular/core';

@Directive()
export class MdBadgeUserDirective {
  readonly badgeDot = model(false);
  readonly badgeNumber = model(0);
}