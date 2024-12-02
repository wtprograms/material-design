import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MdDialogModule, MdSheetModule, MdTabsModule } from '@wtprograms/material-design';
import { MdTabsComponent } from "../../../wtprograms/material-design/src/lib/components/tabs/tabs.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MdTabsModule, MdTabsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
