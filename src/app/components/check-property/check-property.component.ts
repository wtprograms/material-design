import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { v4 } from 'uuid';

@Component({
  selector: 'app-check-property',
  templateUrl: './check-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  host: {
    class: 'tw inline-flex py-2 px-4 grow-0 w-full gap-2'
  }
})
export class CheckPropertyComponent {
  readonly labelId = `label-${v4()}`;
  readonly checked = model.required();
}