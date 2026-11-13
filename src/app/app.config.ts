import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptor/auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Configuración de rutas
    provideRouter(routes),
    // Manejo de intercaptores
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter(),
    provideCharts(withDefaultRegisterables()),
  ],
};
