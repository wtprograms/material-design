import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { PopoverComponent, PopoverTrigger } from '../popover/popover.component';
import { Placement } from '@floating-ui/dom';
import { AttachableDirective } from '../../directives/attachable.directive';

@Component({
  selector: 'md-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [PopoverComponent],
  hostDirectives: [
    {
      directive: AttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {},
})
export class MenuComponent extends MaterialDesignComponent {
  readonly placement = model<Placement>('bottom-start');
  readonly trigger = model<PopoverTrigger>('click');
  readonly offset = model(8);
  readonly popover = viewChild<PopoverComponent>('popover');
  readonly attachableDirective = inject(AttachableDirective);
  readonly useContainerWidth = model(false);

  constructor() {
    super();
    this.attachableDirective.events.set([
      'click',
      'pointerdown',
      'pointerenter',
      'pointerleave',
      'contextmenu',
    ]);
  }
}
