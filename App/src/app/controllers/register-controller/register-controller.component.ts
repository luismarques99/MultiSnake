import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
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

  constructor(public users: UsersService, public router: Router) {}

  ngOnInit(): void {}

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
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.error = error.error.message;
      }
    );
  }
}
