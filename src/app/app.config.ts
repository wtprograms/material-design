import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideClientHydration,
  REMOVE_STYLES_ON_COMPONENT_DESTROY,
  withEventReplay,
} from '@angular/platform-browser';
import routes from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // {
    //   provide: REMOVE_STYLES_ON_COMPONENT_DESTROY,
    //   useValue: false
    // }
  ],
};
