import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAnimationsAsync(),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        audience: environment.auth.audience,
        scope: 'read:tickets create:tickets update:tickets delete:tickets',
        redirect_uri: window.location.origin,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.baseURL}/*`,
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth.audience,
                scope:
                  'read:tickets create:tickets update:tickets delete:tickets',
              },
            },
          },
        ],
      },
    }),
  ],
}).catch((err) => console.error(err));
