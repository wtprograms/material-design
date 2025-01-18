import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppModule } from '../../components/app-components';
import { MdAccordionModule, MdIconModule, MdIconButtonModule, MdSearchModule } from '@wtprograms/material-design';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdSearchModule, MdIconModule, MdIconButtonModule],
})
export default class Page {
  readonly open = signal(false);
  readonly leading = options('none', 'icon', 'button');
  readonly trailing = options('none', 'icon', 'button');
  readonly dialog = signal(false);
}
