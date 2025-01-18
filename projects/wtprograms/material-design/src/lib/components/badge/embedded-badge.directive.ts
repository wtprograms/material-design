import { Directive, model } from '@angular/core';

@Directive()
export class MdEmbeddedBadgeDirective {
  readonly dot = model(false);
  readonly text = model<string>();
}
