import { Directive, effect, HostBinding, HostListener, inject, input, Input, signal } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter, map, tap } from 'rxjs';

@Directive({
  selector: '[selectedLink]',
  standalone: true,
  host: {
    '[attr.selected]': `isSelected() ? '' : null`
  }
})
export class SelectedLinkDirective {
  readonly selectedLink = input<string>();
  readonly isSelected = signal(false);

  private readonly _router = inject(Router);

  constructor() {
    this._router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this._router.url === '/' + this.selectedLink()),
      tap((x) => this.isSelected.set(x))
    ).subscribe();
  }
}