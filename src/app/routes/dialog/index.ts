import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdButtonModule, MdDialogModule, MdIconModule } from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdDialogModule, MdButtonModule, MdIconModule],
})
export default class Page {
  readonly open = signal(false);
  readonly icon = signal(true);
  readonly headline = signal(true);
  readonly supportingText = signal(true);
  readonly body = options('short', 'long', 'none');
  readonly actions = signal(true);
  readonly fullscreen = signal(false);
  readonly requireAction = signal(false);
}
