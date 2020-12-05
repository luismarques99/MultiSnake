import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-private-app',
  templateUrl: './private-app.component.html',
  styleUrls: ['./private-app.component.css'],
})
export class PrivateAppComponent implements OnInit {
  user: any;

  constructor(public session: SessionService, public router: Router) {}

  ngOnInit(): void {
    this.session.me().subscribe((user) => {
      this.user = user;
      this.startGame();
      if (!this.user) {
        const options = this.session.expired
          ? { queryParams: { expired: true } }
          : undefined;
        this.router.navigate(['/login'], options);
      }
    });
  }

  startGame() {
    const canvas: any = document.querySelector('.game');
    const context: any = canvas.getContext('2d');

    let px: number = 10;
    let py: number = 10;
    let gs: number = 20;
    let tc: number = 20;
    let ax: number = 15;
    let ay: number = 15;
    let xv: number = 0;
    let yv: number = 0;
    let trail: any[] = [];
    let tail: number = 5;

    const game = () => {
      px += xv;
      py += yv;

      if (px < 0) px = tc - 1;
      if (px > tc - 1) px = 0;

      if (py < 0) py = tc - 1;
      if (py > tc - 1) py = 0;

      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = 'lime';
      for (let i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
        if (trail[i].x == px && trail[i].y == py) tail = 5;
      }
      trail.push({ x: px, y: py });
      while (trail.length > tail) trail.shift();

      if (ax == px && ay == py) {
        tail++;
        ax = Math.floor(Math.random() * tc);
        ay = Math.floor(Math.random() * tc);
      }

      context.fillStyle = 'red';
      context.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
    };

    const keyPush = (event: any) => {
      switch (event.key) {
        case 'ArrowLeft':
          xv = -1;
          yv = 0;
          break;
        case 'ArrowUp':
          xv = 0;
          yv = -1;
          break;
        case 'ArrowRight':
          xv = 1;
          yv = 0;
          break;
        case 'ArrowDown':
          xv = 0;
          yv = 1;
          break;
      }
    };

    document.addEventListener('keydown', keyPush);
    setInterval(game, 1000 / 10);
  }
}
