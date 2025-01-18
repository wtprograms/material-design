import { Directive, input } from '@angular/core';
import { DialogActionType } from './dialog-action-type';
import { MdDirective } from '../../../common/base/md.directive';

@Directive({
  selector: '[mdDialogAction]',
})
export class MdDialogActionDirective extends MdDirective {
  readonly mdDialogAction = input<DialogActionType>('');
}
