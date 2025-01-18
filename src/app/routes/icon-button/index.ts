import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconButtonVariant, MdIconButtonModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdIconButtonModule],
})
export default class Page {
  readonly variant = options<IconButtonVariant>(
    'standard',
    'filled',
    'tonal',
    'outlined',
    'plain'
  );
  readonly selected = signal(false);
  readonly disabled = signal(false);
  readonly badge = signal(false);
  readonly progressIndicator = signal(false);
}
