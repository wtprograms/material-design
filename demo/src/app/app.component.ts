import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import routes from './routes';
import { SelectedLinkDirective } from './common/directives/selected-link.directives';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, SelectedLinkDirective],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex gap-4 relative'
  }
})
export class AppComponent {
  readonly routes = routes.sort((a, b) => a.path.localeCompare(b.path));
}
