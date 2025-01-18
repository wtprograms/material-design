import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdIconModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdIconModule],
})
export default class Page {
  readonly filled = signal(false);
  readonly badge = signal(false);
}
