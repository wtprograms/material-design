import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { v4 } from 'uuid';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-property',
  templateUrl: './select-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  host: {
    class: 'tw inline-flex py-2 px-4 grow-0 w-full gap-2'
  }
})
export class SelectPropertyComponent {
  readonly labelId = `label-${v4()}`;
  readonly options = input.required<unknown[]>();
  readonly value = model.required<unknown>();
}