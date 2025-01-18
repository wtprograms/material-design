import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdEmbeddedButtonModule, MdRippleModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdRippleModule, MdEmbeddedButtonModule],
})
export default class Page {
  readonly interactive = signal(true);
}
