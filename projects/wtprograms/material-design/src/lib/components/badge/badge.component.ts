import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'md-badge',
  template: `{{ text() }}`,
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.dot]': 'dot()',
    '[class.zero]': 'number() === 0',
    '[class.single-digit]': 'singleDigit()',
    '[class.embedded]': 'embedded()',
  },
})
export class MdBadgeComponent {
  readonly dot = input(false);
  readonly number = input(0);
  readonly embedded = input(false);

  readonly text = computed(() => {
    if (this.number() === 0 || this.dot()) {
      return '';
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
