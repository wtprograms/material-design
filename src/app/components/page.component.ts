import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  template: `
  <div class="inline-flex flex-col bg-background text-background-on rounded-medium overflow-y-auto grow p-4">
    <ng-content />
  </div>
<ul
  class="hidden large:inline-flex flex-col bg-background text-background-on rounded-large overflow-y-auto p-4 min-w-[250px] grow-0">
  <li class="typescale-body-small" i18n>On this page:</li>
  <ng-content select=".navigation" />
</ul>
  `,
  host: {
    class: 'tw contents'
  }
})
export class PageComponent {}