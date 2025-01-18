import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex flex-col grow'
  },
})
export class PageComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  readonly path = toSignal(this._activatedRoute.url);
}