import { Component, signal } from '@angular/core';
import { MdAvatarModule, MdListModule } from '@wtprograms/material-design';
import { ComponentsModule } from '../../components/components.module';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  imports: [ComponentsModule, MdAvatarModule, MdListModule],
})
export default class Page {
  readonly avatar = `<md-avatar [interactive]="true" src="https://avatar.iran.liara.run/public/48" />`;

  readonly type = options('non-interactive', 'interactive', 'anchor');
  readonly size = options(72, 40, 32);
  readonly disabled = signal(false);
  readonly src = signal(false);
  readonly progressIndeterminate = signal(false);
  readonly badge = options('nothing', 'dot', 'number');
}