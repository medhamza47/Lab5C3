import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './app/api-interceptor';

bootstrapApplication(AppComponent, { providers: [provideHttpClient(withInterceptors([apiInterceptor])), ] }).catch(console.error);
