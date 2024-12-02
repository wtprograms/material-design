import { Component } from '@angular/core';
import { MdAppBarModule, MdCardModule, MdScrollToDirective } from '@wtprograms/material-design';
import { CodeComponent } from '../../components/code.component';
import { PageComponent } from '../../components/page.component';

@Component({
  templateUrl: './index.html',
  imports: [MdScrollToDirective, MdCardModule, CodeComponent, PageComponent, MdAppBarModule],
})
export default class Page {
  readonly appBar = `<!-- Top App Bar -->
<md-app-bar>
  <md-icon-button mdAppBarLeading>menu</md-icon-button>
  Title
  <md-icon-button mdAppBarTrailing>search</md-icon-button>
  <md-icon-button mdAppBarTrailing>more_vert</md-icon-button>
</md-app-bar>

<!-- Bottom App Bar -->
<md-app-bar>
  <md-icon-button mdAppBarLeading>content_copy</md-icon-button>
  <md-icon-button mdAppBarLeading>content_cut</md-icon-button>
  <md-icon-button mdAppBarLeading>content_paste</md-icon-button>
  <md-fab mdAppBarTrailing [lowered]="true">
    <md-icon mdFabIcon>add</md-icon>
  </md-fab>
</md-app-bar>`;
}