import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdButtonModule, MdSnackBarModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdSnackBarModule, MdButtonModule],
})
export default class Page {
  readonly open = signal(false);
  readonly action = signal(false);
  readonly closable = signal(false);
  readonly multiline = signal(false);
}
