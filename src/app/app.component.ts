import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MdAppBarModule,
  MdLinkDirective,
  MdMediaDirective,
  MdMenuModule,
  MdNavigationModule,
  MdPopoverModule,
  MdSegmentedButtonModule,
  MdSheetModule,
  MdTooltipModule,
} from '@wtprograms/material-design';
import {
  injectLocalStorage
} from 'ngxtension/inject-local-storage';
import { ssrInjectLocalStorage } from './common/ssr-inject-local-storage';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MdAppBarModule,
    MdSheetModule,
    MdNavigationModule,
    CommonModule,
    MdLinkDirective,
    MdSegmentedButtonModule,
    MdPopoverModule,
    MdTooltipModule,
    MdMenuModule
  ],
  templateUrl: './app.component.html',
  styles: `
    .content {
      height: calc(100dvh - 56px - 16px);
    }
  `,
  host: {
    class:
      'tw inline-flex flex-col w-full bg-surface-container h-dvh max-h-dvh',
  },
})
export class AppComponent {
  readonly theme = ssrInjectLocalStorage('theme', {
    defaultValue: 'system'
  });
  private readonly _document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const theme = this.theme();
      if (theme === 'system') {
        this._document.body.classList.remove('md-dark', 'md-light');
      } else if (theme === 'light') {
        this._document.body.classList.remove('md-dark');
        this._document.body.classList.add('md-light');
      } else {
        this._document.body.classList.remove('md-light');
        this._document.body.classList.add('md-dark');
      }
    });
  }
}
