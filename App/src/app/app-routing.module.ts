import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginControllerComponent } from './controllers/login-controller/login-controller.component';
import { PrivateAppComponent } from './controllers/private-app/private-app.component';
import { RegisterControllerComponent } from './controllers/register-controller/register-controller.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginControllerComponent,
  },
  {
    path: 'register',
    component: RegisterControllerComponent,
  },
  {
    path: '',
    component: PrivateAppComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
