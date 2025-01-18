import { ChangeDetectionStrategy, Component } from '@angular/core';
import routes from '..';
import { RouterModule } from '@angular/router';
import { MdFocusRingModule, MdRippleModule, MdTintModule } from '@wtprograms/material-design';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MdTintModule, MdFocusRingModule, MdRippleModule],
  host: {
    class: 'tw inline-flex gap-4 w-full',
  },
})
export default class Layout {
  readonly routes = routes[0].children;
}
