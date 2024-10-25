import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';

@Component({
  selector: 'md-navigation-headline',
  templateUrl: './navigation-headline.component.html',
  styleUrl: './navigation-headline.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  hostDirectives: [],
  host: {},
})
export class NavigationHeadlineComponent extends MaterialDesignComponent {}
