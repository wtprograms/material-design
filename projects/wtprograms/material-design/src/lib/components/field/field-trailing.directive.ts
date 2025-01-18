import { Directive } from '@angular/core';
import { MdDirective } from '../../common/base/md.directive';

@Directive({
  selector: '[mdFieldTrailing]',
})
export class MdFieldTrailingDirective extends MdDirective {}