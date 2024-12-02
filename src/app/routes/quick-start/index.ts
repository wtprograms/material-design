import { Component } from '@angular/core';
import { MdCardModule, MdScrollToDirective } from '@wtprograms/material-design';
import { CodeComponent } from '../../components/code.component';
import { PageComponent } from '../../components/page.component';

@Component({
  templateUrl: './index.html',
  imports: [MdScrollToDirective, MdCardModule, CodeComponent, PageComponent],
})
export default class Page {
  readonly install = `npm install @wtprograms/material-design`;
  readonly scss = `@import 'node-modules/@wtprograms/material-design/styles';

@include md.initialize;`;
}