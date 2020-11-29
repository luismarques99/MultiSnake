import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-app',
  templateUrl: './private-app.component.html',
  styleUrls: ['./private-app.component.css'],
})
export class PrivateAppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    c; /* onst canv = <HTMLCanvasElement>document.querySelector('.game');
    canv.setAttribute('background-color', 'red');
    let ctx = <CanvasRenderingContext2D>canv.getContext('2d');
    // window.onload = () => {
    //   document.addEventListener('keydown', keyPush);
    //   setInterval(game, 1000 / 15);
    // };

    let px = 10;
    let py = 10;
    let gs = 20;
    let tc = 20;
    let ax = 15;
    let ay = 15;
    let xv = 0;
    let yv = 0;
    let trail: any[] = [];
    let tail = 5;

    const game = () => {
      px += xv;
      py += yv;
      if (px < 0) {
        px = tc - 1;
      }
      if (px > tc - 1) {
        px = 0;
      }
      if (py < 0) {
        py = tc - 1;
      }
      if (py > tc - 1) {
        py = 0;
      }
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canv.width, canv.height);

      ctx.fillStyle = 'lime';
      for (var i = 0; i < trail.length; i++) {
        ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
        if (trail[i].x == px && trail[i].y == py) {
          tail = 5;
        }
      }
      trail.push({ x: px, y: py });
      while (trail.length > tail) {
        trail.shift();
      }

      if (ax == px && ay == py) {
        tail++;
        ax = Math.floor(Math.random() * tc);
        ay = Math.floor(Math.random() * tc);
      }
      ctx.fillStyle = 'red';
      ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
    };
    const keyPush = (event: { keyCode: any }) => {
      switch (event.keyCode) {
        case 37:
          xv = -1;
          yv = 0;
          break;
        case 38:
          xv = 0;
          yv = -1;
          break;
        case 39:
          xv = 1;
          yv = 0;
          break;
        case 40:
          xv = 0;
          yv = 1;
          break;
      }
    };

    document.addEventListener('keydown', keyPush);
    setInterval(game, 1000 / 15); */
  }
}
