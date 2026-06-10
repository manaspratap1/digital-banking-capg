import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideStore } from '@ngrx/store';
import { authReducer } from './core/store/auth/auth.reducer';
import {
  provideStoreDevtools
} from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
    provideStore({auth: authReducer}),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
