import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ThemeService } from './core/services/theme.service';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { NoAuthenticatedGuard } from './core/guards/no-authenticated.guard';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster],
  //  declarations: [
  //   AppComponent,
  //   AdminLayoutComponent,
  //   AuthLayoutComponent
  // ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthenticatedGuard,
    NoAuthenticatedGuard,
  ],
})
export class AppComponent {
  title = 'Angular Tailwind';

  constructor(public themeService: ThemeService) {}
}
