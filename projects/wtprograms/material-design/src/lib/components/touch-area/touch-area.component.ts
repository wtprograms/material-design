import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';

@Component({
  selector: 'md-touch-area',
  templateUrl: './touch-area.component.html',
  styleUrl: './touch-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
})
export class TouchAreaComponent extends MaterialDesignComponent {}
