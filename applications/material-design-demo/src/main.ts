import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '../../../libraries/material-web/dist';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
