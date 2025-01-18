import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  signal,
} from '@angular/core';
import {
  MdFieldModule,
  FieldVariant,
  ControlState,
  MdIconModule,
  MdIconButtonModule,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdFieldModule, MdIconModule, MdIconButtonModule],
})
export default class Page {
  readonly variant = options<FieldVariant>('filled', 'outlined');
  readonly leading = options('none', 'icon', 'image', 'button');
  readonly trailing = options('none', 'icon', 'image', 'button');
  readonly state = options<ControlState>(
    undefined,
    'error',
    'warning',
    'success'
  );
  readonly label = options('none', 'short', 'long');
  readonly labelText = computed(() => {
    const label = this.label();
    if (label === 'short') {
      return 'Short label';
    } else if (label === 'long') {
      return 'Long label text';
    }
    return undefined;
  });
  readonly counterText = signal(false);
  readonly supportingText = signal(false);
  readonly populated = signal(false);
  readonly prefixText = signal(false);
  readonly suffixText = signal(false);
}
