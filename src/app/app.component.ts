import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import routes from './routes';
import {
  ListItemComponent,
  NavigationComponent,
  NavigationItemComponent,
  LinkDirective,
  SheetComponent,
} from '@wtprograms/material-design';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    ListItemComponent,
    NavigationComponent,
    NavigationItemComponent,
    LinkDirective,
    SheetComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'tw flex gap-4 relative',
  },
})
export class AppComponent {
  readonly routes = routes.sort((a, b) => a.title.localeCompare(b.title));
}
