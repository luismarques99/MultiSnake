import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginControllerComponent } from './controllers/login-controller/login-controller.component';
import { PrivateAppComponent } from './controllers/private-app/private-app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterControllerComponent } from './controllers/register-controller/register-controller.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginControllerComponent,
    PrivateAppComponent,
    NavbarComponent,
    RegisterControllerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
