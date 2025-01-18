import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppModule } from '../../components/app-components';
import { MdAccordionModule } from '@wtprograms/material-design';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdAccordionModule],
})
export default class Page {
  readonly open = signal(false);
}
