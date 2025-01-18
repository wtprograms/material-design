import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../common/base/md.component';

@Component({
  selector: '[mdEmbeddedButton]',
  templateUrl: './embedded-button.component.html',
  styleUrls: ['./embedded-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdEmbeddedButtonComponent extends MdComponent {}
