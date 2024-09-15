import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import routes from './routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex gap-4 relative'
  }
})
export class AppComponent {
  readonly routes = routes.sort((a, b) => a.path.localeCompare(b.path));
}
