import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MdIconModule } from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';
import { options } from '../../common/options';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdIconModule],
})
export default class Page {
  readonly filled = signal(false);
  readonly badge = signal(false);
    readonly size = options(undefined, 24, 48, 72);
}
