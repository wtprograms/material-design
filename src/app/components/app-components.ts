import { NgModule } from '@angular/core';
import { CheckPropertyComponent } from './check-property/check-property.component';
import { PageComponent } from './page/page.component';
import { PropertiesComponent } from './properties/properties.component';
import { SelectPropertyComponent } from './select-property/select-property.component';

@NgModule({
  imports: [
    PageComponent,
    PropertiesComponent,
    SelectPropertyComponent,
    CheckPropertyComponent,
  ],
  exports: [
    PageComponent,
    PropertiesComponent,
    SelectPropertyComponent,
    CheckPropertyComponent,
  ],
})
export class AppModule {}
