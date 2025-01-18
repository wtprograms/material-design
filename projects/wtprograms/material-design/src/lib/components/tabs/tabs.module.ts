import { NgModule } from '@angular/core';
import { MdTabsComponent } from './tabs.component';
import { MdTabComponent } from './tab/tab.component';

@NgModule({
  imports: [MdTabsComponent, MdTabComponent],
  exports: [MdTabsComponent, MdTabComponent],
})
export class MdTabsModule {}
