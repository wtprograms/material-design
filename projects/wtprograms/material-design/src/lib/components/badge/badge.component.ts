import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';

@Component({
  selector: 'md-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  host: {
    '[attr.dot]': 'dot() || null',
    '[attr.number]': 'text() ?? null',
    '[attr.embedded]': 'embedded() || null',
    '[attr.singleDigit]': 'singleDigit() || null',
  },
})
export class BadgeComponent extends MaterialDesignComponent {
  readonly dot = model(false);
  readonly number = model<number>();
  readonly embedded = model(false);

  readonly text = computed(() => {
    if (this.dot()) {
      return;
    }
    const number = this.number();
    if (!number) {
      return;
    }
    return number > 999 ? '999+' : number;
  });
  readonly singleDigit = computed(() =>
    this.number() ? this.number()! < 10 : false
  );
}
