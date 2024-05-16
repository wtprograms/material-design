import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appRouterLink]',
  standalone: true,
  host: {
    '[attr.href]': 'href()',
  },
})
export class RouterLinkDirective {
  readonly appRouterLink = input<any[] | string>();
  readonly appRouterLinkSelectable = input(false, {
    transform: (value) => value === '' || value === 'true',
  });
  readonly appRouterLinkActiveClass = input('');

  private readonly _router = inject(Router);
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly urlTree = computed(() => {
    let link = this.appRouterLink();
    link = Array.isArray(link) ? link : [link];
    return this._router.createUrlTree(link);
  });
  readonly href = computed(() => this.urlTree().toString());
  readonly currentUrl = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._router.url)
    )
  );
  readonly isActive = computed(() => this.href() === this.currentUrl());

  constructor() {
    effect(() => {
      if (this.isActive()) {
        this.handleActive();
      } else {
        this.handleInactive();
      }
    });
  }

  private handleActive() {
    if (this.appRouterLinkSelectable()) {
      this._elementRef.nativeElement.setAttribute('selected', '');
    } else if (this.appRouterLinkActiveClass()) {
      this._elementRef.nativeElement.classList.add(
        ...this.appRouterLinkActiveClass().split(' ')
      );
    }
  }

  private handleInactive() {
    if (this.appRouterLinkSelectable()) {
      this._elementRef.nativeElement.removeAttribute('selected');
    } else if (this.appRouterLinkActiveClass()) {
      this._elementRef.nativeElement.classList.remove(
        ...this.appRouterLinkActiveClass().split(' ')
      );
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this._router.navigateByUrl(this.urlTree());
  }
}
