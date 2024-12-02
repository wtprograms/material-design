import { NgModule } from '@angular/core';
import { MdSnackBarComponent } from './snack-bar.component';
import { MdSnackBarHandlerComponent } from './snack-bar-handler/snack-bar-handler.component';

@NgModule({
  imports: [
    MdSnackBarComponent,
    MdSnackBarHandlerComponent,
  ],
  exports: [
    MdSnackBarComponent,
    MdSnackBarHandlerComponent,
  ],
})
export class MdSnackBarModule {}
