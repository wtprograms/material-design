import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdTintModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdTintModule],
})
export default class Page {
  readonly hoverable = signal(true);
}
