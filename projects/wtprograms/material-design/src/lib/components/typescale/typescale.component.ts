import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';

export type Typescale = 'display' | 'headline' | 'body' | 'title' | 'label';
export type TypescaleSize = 'large' | 'medium' | 'small';

@Component({
  selector: 'md-typescale',
  templateUrl: './typescale.component.html',
  styleUrl: './typescale.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  hostDirectives: [],
  host: {
    '[attr.scale]': 'scale()',
    '[attr.size]': 'size()',
  },
})
export class TypescaleComponent extends MaterialDesignComponent {
  readonly scale = model<Typescale>('body');
  readonly size = model<TypescaleSize>('medium');
}
