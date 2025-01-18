import { Directive } from '@angular/core';
import { MdDirective } from '../../common/base/md.directive';

@Directive({
  selector: '[mdSearchLeading]',
})
export class MdSearchLeadingDirective extends MdDirective {}