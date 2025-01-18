import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MdIconModule,
  MdSegmentedButtonModule,
  MdSegmentedButtonComponent,
} from '@wtprograms/material-design';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdSegmentedButtonModule, MdIconModule],
})
export default class Page {
  readonly disabled = signal(false);
  readonly selected = signal(false);
  readonly useCheckIcon = signal(false);
  readonly selectedItem = signal<MdSegmentedButtonComponent | undefined>(
    undefined
  );
  readonly radioValue = signal<number>(1);
}
