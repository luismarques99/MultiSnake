import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login-controller',
  templateUrl: './login-controller.component.html',
  styleUrls: ['./login-controller.component.css'],
})
export class LoginControllerComponent implements OnInit {
  username: String = '';
  password: String = '';

  constructor(public session: SessionService) {}

  ngOnInit(): void {}

  onSubmit(event: any): void {
    event.preventDefault();
    this.session.login(this.username, this.password);
  }
}
