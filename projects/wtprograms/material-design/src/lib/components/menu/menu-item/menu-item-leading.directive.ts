import { Directive } from '@angular/core';
import { MdDirective } from '../../../common/base/md.directive';

@Directive({
  selector: '[mdMenuItemLeading]',
})
export class MdMenuItemLeadingDirective extends MdDirective {}
