import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MdComponent } from '../md.component';

@Component({
  selector: 'md-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdAppBarComponent extends MdComponent {}
