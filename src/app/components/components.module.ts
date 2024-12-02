import { NgModule } from '@angular/core';
import { CodeComponent } from './code.component';
import { DemoComponent } from './demo.component';
import { PageComponent } from './page.component';
import { PropertiesComponent } from './properties.component';
import { CommonModule } from '@angular/common';
import { MdCardModule, MdScrollToDirective } from '@wtprograms/material-design';
import { PropertyComponent } from './property.component';

@NgModule({
  imports: [CodeComponent, DemoComponent, PropertyComponent, PageComponent, PropertiesComponent, MdScrollToDirective],
  exports: [CodeComponent, DemoComponent, PropertyComponent, PageComponent, PropertiesComponent, MdScrollToDirective, MdCardModule, CommonModule],
})
export class ComponentsModule {}