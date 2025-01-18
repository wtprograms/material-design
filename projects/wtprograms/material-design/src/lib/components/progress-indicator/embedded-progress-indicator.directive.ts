import { Directive, input } from '@angular/core';

@Directive()
export class MdEmbeddedProgressIndicatorDirective {
  readonly value = input(0);
  readonly max = input(1);
  readonly indeterminate = input(false);
  readonly buffer = input(0);
}
