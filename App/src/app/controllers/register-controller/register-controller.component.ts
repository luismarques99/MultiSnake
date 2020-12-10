import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SessionService } from 'src/app/services/session.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register-controller',
  templateUrl: './register-controller.component.html',
  styleUrls: ['./register-controller.component.css'],
})
export class RegisterControllerComponent implements OnInit {
  username: String = '';
  email: String = '';
  password: String = '';
  error: String = '';

  constructor(
    public session: SessionService,
    public users: UsersService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.session.me().subscribe((user) => {
      if (user) this.router.navigate(['/']);
    });
  }

  onSubmit(event: any): void {
    event.preventDefault();
    this.error = '';
    const user: User = {
      username: this.username,
      email: this.email,
      password: this.password,
    };
    this.users.createUser(user).subscribe(
      (user) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.error = error.error.message;
      }
    );
  }
}
