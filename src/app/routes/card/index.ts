import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CardVariant, MdButtonModule, MdCardModule } from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdCardModule, MdButtonModule],
})
export default class Page {
  readonly variant = options<CardVariant>('elevated', 'filled', 'outlined');
  readonly disabled = signal(false);
  readonly anchor = signal(false);
  readonly interactive = signal(false);
}
