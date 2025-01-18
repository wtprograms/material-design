import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule],
})
export default class Page {}
