import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RouterLinkDirective } from './common/directives/router-link.directive';
import { CommonModule } from '@angular/common';
import { LINKS } from './routes/links';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkDirective],
  templateUrl: './app.component.html',
  host: {
    class: 'tw fixed inset-0 flex  gap-4',
  },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  readonly links = LINKS;
}
