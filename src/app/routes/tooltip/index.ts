import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdButtonModule,
  MdTooltipModule,
  TooltipVariant,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdTooltipModule, MdButtonModule],
})
export default class Page {
  readonly variant = options<TooltipVariant>('plain', 'rich');
  readonly open = signal(false);
}
