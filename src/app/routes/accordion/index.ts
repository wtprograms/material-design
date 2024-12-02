import { Component } from '@angular/core';
import { MdAccordionModule, MdCardModule, MdScrollToDirective } from '@wtprograms/material-design';
import { CodeComponent } from '../../components/code.component';
import { PageComponent } from '../../components/page.component';

@Component({
  templateUrl: './index.html',
  imports: [MdScrollToDirective, MdCardModule, CodeComponent, PageComponent, MdAccordionModule],
})
export default class Page {
  readonly accordion = `<md-accordion>
  <span mdAccordionHeadline>Headline</span>
  The contents of the accordion is here.
</md-accordion>`;
}