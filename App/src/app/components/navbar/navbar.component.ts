import { Component, Input, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input()
  user: any;

  @Input()
  score: any;

  @Input()
  highScore: any;

  constructor(public session: SessionService) {}

  ngOnInit(): void {}

  logout() {
    this.session.logout();
  }
}
