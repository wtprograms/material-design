import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonVariant, MdButtonModule, MdIconModule } from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdButtonModule, MdIconModule],
})
export default class Page {
  readonly variant = options<ButtonVariant>(
    'elevated',
    'filled',
    'tonal',
    'outlined',
    'text',
    'plain'
  );
  readonly leading = options('none', 'icon', 'img');
  readonly trailing = options('none', 'icon', 'badge');
  readonly disabled = signal(false);
  readonly anchor = signal(false);
  readonly progressIndicator = signal(false);
}
