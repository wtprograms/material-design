import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-color-entry',
  templateUrl: './color-entry.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorEntryComponent {
  readonly backgroundColor = input.required<string>();
  readonly color = input<string>();

  styles(reverse = false) {
    let properties = ['background-color', 'color'];
    if (reverse) {
      properties = properties.reverse();
    }
    const color = this.color() ? this.color() : `${this.backgroundColor()}-on`;
    return {
      [properties[0]]: `var(--md-sys-color-${this.backgroundColor()})`,
      [properties[1]]: `var(--md-sys-color-${color})`,
    }
  }
}
