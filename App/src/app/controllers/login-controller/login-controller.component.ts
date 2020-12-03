import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login-controller',
  templateUrl: './login-controller.component.html',
  styleUrls: ['./login-controller.component.css'],
})
export class LoginControllerComponent implements OnInit {
  username: String = '';
  password: String = '';
  error: String = '';

  constructor(public session: SessionService, public router: Router) {}

  ngOnInit(): void {}

  onSubmit(event: any): void {
    event.preventDefault();
    this.error = '';
    const user = { username: this.username, password: this.password };
    this.session.login(user).subscribe(
      (user) => {
        this.router.navigateByUrl('/');
      },
      (error) => {
        this.error = error.error.message;
      }
    );
  }
}
