import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandler, NgModule, Provider } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { JwtModule } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GlobalErrorHandler } from "./services/global-error-handler";
import { HttpLoggingInterceptor } from "./services/http-logging.interceptor";
import { SharedModule } from "./shared/shared.module";

const HTTP_INTERCEPTOR_PROVIDERS: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpLoggingInterceptor, multi: true },
];

const COMPONENTS = [AppComponent];

const MODULES = [
  BrowserModule,
  AppRoutingModule,
  ReactiveFormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  JwtModule.forRoot({
    config: {
      tokenGetter: () => localStorage.getItem("session_token"),
      allowedDomains: [environment.host],
      disallowedRoutes: [],
    },
  }),
];

const PROVIDERS: any[] = [
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES, SharedModule],
  providers: [...PROVIDERS, ...HTTP_INTERCEPTOR_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
