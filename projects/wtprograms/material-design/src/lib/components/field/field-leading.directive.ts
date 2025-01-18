import { Directive } from '@angular/core';
import { MdDirective } from '../../common/base/md.directive';

@Directive({
  selector: '[mdFieldLeading]',
})
export class MdFieldLeadingDirective extends MdDirective {}