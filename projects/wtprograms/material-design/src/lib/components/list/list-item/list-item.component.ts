import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  ElementRef,
  inject,
  input,
  model,
} from '@angular/core';
import { MdComponent } from '../../md.component';
import { MdDividerComponent } from '../../divider/divider.component';
import { CommonModule } from '@angular/common';
import { dispatchActivationClick } from '../../../common/events/dispatch-activation-click';
import { ButtonType } from '../../button/button.component';
import { MdEmbeddedButtonModule } from '../../embedded-button/embedded-button.module';
import { MdFocusRingComponent } from '../../focus-ring/focus-ring.component';
import { MdRippleComponent } from '../../ripple/ripple.component';
import { MdListItemTrailingDirective } from './list-item-trailing.directive';
import { MdProgressIndicatorUserDirective } from '../../progress-indicator/progress-indicator-user.directive';
import { MdProgressIndicatorModule } from '../../progress-indicator/progress-indicator.module';

@Component({
  selector: 'md-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdRippleComponent,
    MdFocusRingComponent,
    MdDividerComponent,
    CommonModule,
    MdEmbeddedButtonModule,
    MdProgressIndicatorModule
  ],
  hostDirectives: [
    {
      directive: MdProgressIndicatorUserDirective,
      inputs: [
        'progressValue',
        'progressMax',
        'progressIndeterminate',
        'progressBuffer'
      ]
    }
  ],
  host: {
    '[class.selected]': 'selected()',
    '[class.interactive]': 'interactive()',
    '[class.split]': 'split()',
    '[class.disabled]': 'disabled()',
    '[class.large]': 'large()',
    '[class.align-top]': 'alignTop()',
    '(click)': 'click($event)',
  },
})
export class MdListItemComponent extends MdComponent {
  readonly progressIndicatorUser = inject(MdProgressIndicatorUserDirective);
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly interactive = model(false);
  readonly split = input(false);
  readonly value = model<unknown>();
  readonly selected = model(false);
  readonly large = input(false);
  readonly alignTop = input(false);

  private readonly _trailing = contentChildren(MdListItemTrailingDirective, {
    read: ElementRef,
  });

  click(event: Event) {
    if (this.split() || !this.interactive()) {
      return;
    }

    if (this._trailing().length) {
      for (const element of this._trailing()) {
        dispatchActivationClick(element.nativeElement, false);
      }
    }
  }
}
