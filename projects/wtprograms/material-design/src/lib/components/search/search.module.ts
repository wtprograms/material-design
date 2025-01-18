import { NgModule } from '@angular/core';
import { MdSearchLeadingDirective } from './search-leading.directive';
import { MdSearchTrailingDirective } from './search-trailing.directive';
import { MdSearchComponent } from './search.component';

@NgModule({
  imports: [
    MdSearchComponent,
    MdSearchLeadingDirective,
    MdSearchTrailingDirective,
  ],
  exports: [
    MdSearchComponent,
    MdSearchLeadingDirective,
    MdSearchTrailingDirective,
  ],
})
export class MdSearchModule {}
