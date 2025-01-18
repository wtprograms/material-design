import { Directive, input } from '@angular/core';
import { SheetActionType } from './sheet-action-type';
import { MdDirective } from '../../../common/base/md.directive';

@Directive({
  selector: '[mdSheetAction]',
})
export class MdSheetActionDirective extends MdDirective {
  readonly mdSheetAction = input<SheetActionType>('');
}
