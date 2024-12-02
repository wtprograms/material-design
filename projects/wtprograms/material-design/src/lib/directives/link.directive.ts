import {
  Directive,
  input,
  inject,
  computed,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[mdLink]',
  host: {
    '[attr.href]': 'href()',
    '[class]': 'class()',
  },
})
export class MdLinkDirective {
  readonly mdLink = input.required<unknown | unknown[]>();
  readonly mdLinkActiveClass = input<string>();
  readonly mdLinkExact = input(false);
  readonly mdLinkSelectable = input<boolean | ''>(true);
  readonly mdLinkOutlet = input<string>();

  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);

  readonly href = computed(() =>
    this.mdLinkOutlet() ? undefined : this.#router.serializeUrl(this.urlTree()),
  );

  readonly urlTree = computed(() => {
    const link = this.mdLink();
    const commands: unknown[] =
      typeof link === 'string' || typeof link === 'number'
        ? [link]
        : (link as unknown[]);
    return this.#router.createUrlTree(commands, {
      relativeTo: this.#activatedRoute,
    });
  });

  readonly class = toSignal(
    this.#router.events.pipe(
      startWith(null),
      filter(() => this.mdLinkSelectable() || !!this.mdLinkActiveClass()),
      filter((event) => event instanceof NavigationEnd),
      map(() => this.#router.isActive(this.urlTree(), this.mdLinkExact())),
      map((isActive) => (isActive ? (this.mdLinkActiveClass() ?? '') : '')),
    ),
  );

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    if (this.mdLinkOutlet()) {
      this.#router.navigate(
        [
          {
            outlets: {
              [this.mdLinkOutlet()!]: this.href(),
            },
          },
        ],
        {
          relativeTo: this.#activatedRoute,
        },
      );
    } else {
      this.#router.navigate([this.href()], {
        relativeTo: this.#activatedRoute,
      });
    }
  }
}
