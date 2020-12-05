import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    public session: SessionService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.expired) {
        this.error = 'Your session has expired!';
      }
    });
  }

  onSubmit(event: any): void {
    event.preventDefault();
    this.error = '';
    const user = { username: this.username, password: this.password };
    this.session.login(user).subscribe(
      (user) => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.error = error.error.message;
      }
    );
  }
}
