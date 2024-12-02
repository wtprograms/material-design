import { NgModule } from '@angular/core';
import { MdTabLeadingDirective } from './tab/tab-leading.directive';
import { MdTabComponent } from './tab/tab.component';
import { MdIconModule } from '@wtprograms/material-design';

@NgModule({
  imports: [MdTabLeadingDirective, MdTabComponent],
  exports: [MdTabLeadingDirective, MdTabComponent, MdIconModule],
})
export class MdTabsModule {}