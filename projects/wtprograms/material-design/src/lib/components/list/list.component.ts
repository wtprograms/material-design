import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { MdComponent } from '../md.component';

@Component({
  selector: 'md-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdListComponent extends MdComponent {}
