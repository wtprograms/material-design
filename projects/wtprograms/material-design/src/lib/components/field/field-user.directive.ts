import { Directive, input } from '@angular/core';
import { FieldVariant } from './field.component';

@Directive()
export class MdFieldUserDirective {
  readonly label = input<string>();
  readonly variant = input<FieldVariant>('filled');
  readonly supportingText = input<string>();
  readonly counter = input<string>();
  readonly prefix = input<string>();
  readonly suffix = input<string>();
}