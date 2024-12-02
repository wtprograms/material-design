import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../md.component';

@Component({
  selector: '[mdEmbeddedButton]',
  templateUrl: './embedded-button.component.html',
  styleUrl: './embedded-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdEmbeddedButtonComponent extends MdComponent {}
