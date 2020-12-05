import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginControllerComponent } from './controllers/login-controller/login-controller.component';
import { PrivateAppComponent } from './controllers/private-app/private-app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterControllerComponent } from './controllers/register-controller/register-controller.component';

import { HeaderInterceptor } from './interceptors/header.interceptor';
import { SessionLostInterceptor } from './interceptors/session-lost.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginControllerComponent,
    PrivateAppComponent,
    NavbarComponent,
    RegisterControllerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionLostInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
