import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import routes from './routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration()],
};
