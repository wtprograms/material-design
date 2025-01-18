import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Placement } from '@floating-ui/dom';
import {
  MdButtonModule,
  MdPopoverModule,
  PopoverTrigger,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  styles: `:host {
  md-popover.px200 {
    width: 200px;
  }
}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdPopoverModule, MdButtonModule],
  host: {
    ngSkipHydration: '',
  },
})
export default class Page {
  readonly trigger = options<PopoverTrigger>(
    'click',
    'contextmenu',
    'focus',
    'hover',
    'hover',
    'manual'
  );
  readonly placement = options<Placement>(
    'bottom',
    'bottom-end',
    'bottom-start',
    'bottom-end',
    'left',
    'left-end',
    'left-start',
    'right',
    'right-end',
    'right-start',
    'top',
    'top-end',
    'top-start'
  );
  readonly offset = options(0, 10, 20, 30);
  readonly width = options('auto', 'target', '200px');
  readonly shift = signal(true);
  readonly flip = signal(true);
  readonly open = signal(false);
  readonly closeOnLeave = signal(true);
}
