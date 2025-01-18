import { Directive, input } from '@angular/core';
import { CheckIconValue } from './check-icon-value';
import { MdDirective } from '../../../common/base/md.directive';

@Directive({
  selector: '[mdCheckIcon]',
})
export class MdCheckIconDirective extends MdDirective {
  readonly mdCheckIcon = input.required<CheckIconValue>();
}
