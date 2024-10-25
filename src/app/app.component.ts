import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import routes from './routes';
import { ListItemComponent } from '../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { LinkDirective } from '../../projects/wtprograms/material-design/src/lib/directives/link.directive';
import { NavigationComponent } from '../../projects/wtprograms/material-design/src/lib/components/navigation/navigation.component';
import { NavigationItemComponent } from '../../projects/wtprograms/material-design/src/lib/components/navigation-item/navigation-item.component';
import { SheetComponent } from '../../projects/wtprograms/material-design/src/lib/components/sheet/sheet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ListItemComponent, NavigationComponent, NavigationItemComponent, LinkDirective, SheetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'tw flex gap-4 relative'
  }
})
export class AppComponent {
  readonly routes = routes.sort((a, b) => a.title.localeCompare(b.title));
}
