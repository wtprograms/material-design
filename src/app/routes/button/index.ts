import { Component, signal } from '@angular/core';
import { ButtonVariant, MdAvatarModule, MdButtonModule, MdListModule } from '@wtprograms/material-design';
import { ComponentsModule } from '../../components/components.module';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  imports: [ComponentsModule, MdButtonModule],
})
export default class Page {
  readonly button = `<md-button>
  <md-icon mdButtonLeading>home</md-icon>
  Home
</md-button>`;

  readonly anchor = signal(false);
  readonly variant = options<ButtonVariant>('elevated', 'filled', 'outlined', 'text', 'tonal', 'plain');
  readonly disabled = signal(false);
  readonly leading = signal(false);
  readonly trailing = signal(false);
  readonly progressIndeterminate = signal(false);
}