import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdBadgeModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdBadgeModule],
})
export default class Page {
  readonly display = options('New', '1', '12', '123', '1234', 'dot');
  readonly embedded = signal(false);
}
