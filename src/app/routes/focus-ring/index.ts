import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdFocusRingModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdFocusRingModule],
})
export default class Page {
  readonly focusVisible = signal(true);
}
