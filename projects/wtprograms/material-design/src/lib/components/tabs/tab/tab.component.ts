import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  model,
  viewChild,
  ElementRef,
  contentChild,
  effect,
  forwardRef,
} from '@angular/core';
import { TabsLayout } from '../tabs-layout';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TabType } from './tab-type';
import { MdBadgeComponent } from '../../badge/badge.component';
import { MdEmbeddedBadgeDirective } from '../../badge/embedded-badge.directive';
import { MdEmbeddedButtonComponent } from '../../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../../focus-ring/focus-ring.component';
import { MdIconComponent } from '../../icon/icon.component';
import { MdRippleComponent } from '../../ripple/ripple.component';
import { MdTintComponent } from '../../tint/tint.component';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    CommonModule,
    MdBadgeComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
  ],
  hostDirectives: [
    {
      directive: MdEmbeddedBadgeDirective,
      inputs: ['dot: badgeDot', 'text: badgeText'],
    },
  ],
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.selected]': 'selected() ? "" : null',
    '[attr.layout]': 'layout()',
    '[attr.type]': 'type()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdTabComponent),
    },
  ],
})
export class MdTabComponent extends MdComponent {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly type = model<TabType>('button');
  readonly href = input<string>();
  readonly target = input<string>();
  readonly disabled = input(false);
  readonly selected = model(false);
  readonly value = model<boolean | number | string>();
  readonly radioValue = input<string | boolean | number>();
  readonly embeddedButtonElement = viewChild<
    MdEmbeddedButtonComponent,
    ElementRef<HTMLElement>
  >(MdEmbeddedButtonComponent, { read: ElementRef });
  readonly contents = viewChild<ElementRef<HTMLElement>>('contents');
  readonly layout = model<TabsLayout>('primary');
  private readonly _icon = contentChild(MdIconComponent);

  constructor() {
    super();
    effect(() => {
      const layout = this.layout();
      const dot = this.embeddedBadge.dot();
      const text = this.embeddedBadge.text();
      const icon = this._icon();
      if (!icon) {
        return;
      }
      if (layout === 'primary') {
        icon.embeddedBadge.dot.set(dot);
        icon.embeddedBadge.text.set(text);
      } else {
        icon.embeddedBadge.dot.set(false);
        icon.embeddedBadge.text.set(undefined);
      }
    });
    effect(() => {
      const type = this.type();
      const value = this.value();
      const radioValue = this.radioValue();
      const selected = this.selected();
      if (type === 'radio') {
        this.selected.set(value === radioValue);
      } else if (type === 'checkbox') {
        this.value.set(selected);
      }
    });
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.type() === 'radio') {
      this.value.set(this.radioValue());
    } else {
      this.selected.set(input.checked);
    }
  }
}
