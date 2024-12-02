import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  MdCardComponent,
  MdCardModule,
  MdIconButtonModule,
  observeResize,
} from '@wtprograms/material-design';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'app-code',
  template: `
    <md-card #card variant="filled" class="border border-outline my-4 grow" style="visibility: hidden">
      <md-icon-button class="absolute end-1 top-1" (click)="copy()"
        >content_copy</md-icon-button
      >
      <pre #preElement class="absolute p-0 mt-[-1rem] mx-0 mb-[-2rem]">
        <code #codeElement [highlight]="code()" [language]="language()" class="bg-[transparent] p-0"></code>
      </pre>
    </md-card>
  `,
  imports: [HighlightModule, MdCardModule, MdIconButtonModule],
  host: {
    class: 'tw inline-flex',
  },
})
export class CodeComponent {
  readonly code = input.required<string>();
  readonly language = input.required<string>();

  private readonly _hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly _cardElement = viewChild<
    MdCardComponent,
    ElementRef<HTMLPreElement>
  >('card', { read: ElementRef });
  private readonly _preElement =
    viewChild<ElementRef<HTMLPreElement>>('preElement');
  private readonly _codeElement =
    viewChild<ElementRef<HTMLElement>>('codeElement');
  private readonly _size = observeResize(this._hostElement);

  constructor() {
    effect(() => {
      const pre = this._preElement()!.nativeElement;
      const size = this._size();
      if (!size) {
        return;
      }
      pre.style.width = `${size.width - 48}px`;
    });
    effect(() => {
      const pre = this._preElement()!.nativeElement;
      const card = this._cardElement()!.nativeElement;
      setTimeout(() => {
        card.style.height = `${pre.offsetHeight - 16}px`;
        card.style.visibility = 'visible';
      }, 200);
    });
    
  }

  copy() {
    navigator.clipboard.writeText(this.code());
  }
}
