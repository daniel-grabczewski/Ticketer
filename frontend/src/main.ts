import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/auth-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi() // Include interceptors provided via DI
    ),
    provideAnimationsAsync(),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        audience: environment.auth.audience,
        scope: 'read:tickets create:tickets update:tickets delete:tickets',
        redirect_uri: window.location.origin,
      },
    }),
    // Provide the custom interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
