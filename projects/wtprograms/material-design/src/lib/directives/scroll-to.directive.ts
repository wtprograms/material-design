import { DOCUMENT } from '@angular/common';
import { computed, Directive, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[mdScrollTo]',
  host: {
    '[attr.href]': 'href()',
    '(click)': 'click($event)',
  }
})
export class MdScrollToDirective {
  readonly mdScrollTo = input.required<string>();
  private readonly _document = inject(DOCUMENT);

  private readonly _target = computed(() =>
    this._document.getElementById(this.mdScrollTo())
  );

  private readonly _router = inject(Router);

  readonly href = computed(() => 
    this._router.url + '#' + this.mdScrollTo()
  )

  click(event: Event) {
    event.preventDefault();
    this._target()?.scrollIntoView({ behavior: 'smooth' });
  }
}
