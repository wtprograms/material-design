import {
  Directive,
  OnDestroy,
  input,
  inject,
  ElementRef,
  computed,
  HostListener,
  effect,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter, startWith, map, tap } from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';

@Directive({
  selector: '[mdLink]',
  standalone: true,
})
export class LinkDirective implements OnDestroy {
  readonly mdLink = input.required<unknown | unknown[]>();
  readonly mdLinkActiveClass = input<string>();
  readonly mdLinkExact = input(false);
  readonly mdLinkSelectable = input<boolean | ''>(true);
  readonly mdLinkOutlet = input<string>();

  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  readonly href = computed(() =>
    this.mdLinkOutlet() ? undefined : this._router.serializeUrl(this.urlTree())
  );

  readonly urlTree = computed(() => {
    const link = this.mdLink();
    const commands: unknown[] =
      typeof link === 'string' || typeof link === 'number'
        ? [link]
        : (link as unknown[]);
    return this._router.createUrlTree(commands, {
      relativeTo: this._activatedRoute,
    });
  });

  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);

  private get _component() {
    return MaterialDesignComponent.get(this._element.nativeElement);
  }

  private _subscription?: Subscription;

  constructor() {
    effect(
      () => {
        const href = this.href();
        if (!href) {
          return;
        }
        if (this._component) {
          this._component.href?.set(href);
        } else {
          this._element.nativeElement.setAttribute('href', href);
        }
      },
      {
        allowSignalWrites: true,
      }
    );
    this._router.events
      .pipe(
        startWith(null),
        filter(() => this.mdLinkSelectable() || !!this.mdLinkActiveClass()),
        filter((event) => event instanceof NavigationEnd),
        map(() => this._router.isActive(this.urlTree(), this.mdLinkExact())),
        tap((isActive: boolean) => {
          if (this._component && 'selected' in this._component) {
            this._component.selected.set(isActive);
          }
          if (isActive && this.mdLinkActiveClass()) {
            this._element.nativeElement.classList.add(
              this.mdLinkActiveClass()!
            );
          } else {
            this._element.nativeElement.classList.remove(
              this.mdLinkActiveClass()!
            );
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    if (this.mdLinkOutlet()) {
      this._router.navigate(
        [
          {
            outlets: {
              [this.mdLinkOutlet()!]: this.href(),
            },
          },
        ],
        {
          relativeTo: this._activatedRoute,
        }
      );
    } else {
      this._router.navigate([this.href()], {
        relativeTo: this._activatedRoute,
      });
    }
  }
}
