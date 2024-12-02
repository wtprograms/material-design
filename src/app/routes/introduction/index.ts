import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MdCardModule, MdScrollToDirective } from '@wtprograms/material-design';
import { CodeComponent } from '../../components/code.component';
import { PageComponent } from '../../components/page.component';

@Component({
  templateUrl: './index.html',
  imports: [MdScrollToDirective, MdCardModule, CommonModule, CodeComponent, PageComponent],
})
export default class Page {
  readonly forWhom = `<!-- This demonstrates the use of a simple button and dialog. -->
<md-button (click)="dialog.open()">Open Dialog</md-button>
<dialog mdDialog>
  <md-icon mdDialogIcon>info</md-icon>
  <span mdDialogHeadline>About</span>
  This is a simple dialog.
  <md-button mdDialogAction (click)="dialog.open.set(false)">Close</md-button>
</dialog>`;
  readonly tokens = `<!-- This demonstrates setting the tokens. -->
:host {
  --md-ref-palette-hue-base: 150;
  --md-sys-shape-small: 2px;
}`;
}
