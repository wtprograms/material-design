import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { MdComponent } from '../../common/base/md.component';

@Component({
  selector: 'md-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.dot]': 'dot() ? "" : null',
    '[attr.embedded]': 'embedded() ? "" : null',
    '[attr.zero]': 'text() === "0" || text() === undefined ? "" : null',
    '[attr.single-digit]': 'singleDigit() ? "" : null',
  },
})
export class MdBadgeComponent extends MdComponent {
  readonly dot = input(false);
  readonly embedded = input(false);
  readonly text = input<string>();

  readonly number = computed(() => {
    const text = this.text();
    if (!text) {
      return 0;
    }
    const number = parseInt(text, 10);
    return isNaN(number) ? 0 : number;
  })

  readonly content = computed(() => {
    const text = this.text();
    if (this.number() === 0) {
      return text;
    }
    const number = this.number();
    if (!number) {
      return undefined;
    }
    return number > 999 ? '999+' : number;
  });

  readonly singleDigit = computed(() =>
    this.number() ? this.number()! < 10 : false
  );
}