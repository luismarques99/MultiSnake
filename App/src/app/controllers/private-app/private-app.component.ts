import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

declare const WebSocketManager: any;

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
      this.game();
      if (!this.user) {
        const options = this.session.expired
          ? { queryParams: { expired: true } }
          : undefined;
        this.router.navigate(['/login'], options);
      }
    });
  }

  game() {
    const canvas: any = document.querySelector('.game');
    const context: any = canvas.getContext('2d');

    const connection = new WebSocketManager.Connection(
      'ws://localhost:3030/server'
    );

    const field: any = { gridSize: 20, tileCount: 20 };
    let snake: Snake;
    let apple: Apple;
    let alive: boolean = true;

    class Apple {
      xPos: number;
      yPos: number;

      constructor(xPos: number, yPos: number) {
        this.xPos = xPos;
        this.yPos = yPos;
      }
    }

    class Snake {
      id: String;
      xPos: number;
      yPos: number;
      xVel: number;
      yVel: number;
      tail: number;
      trail: any[];

      constructor(xPos: number, yPos: number) {
        this.id = '';
        this.xPos = xPos;
        this.yPos = yPos;
        this.xVel = 0;
        this.yVel = 0;
        this.tail = 5;
        this.trail = [];
      }

      eat() {
        this.tail++;

        let appleXPos = Math.floor(Math.random() * field.tileCount);
        let appleYPos = Math.floor(Math.random() * field.tileCount);
        while (snake.contains(appleXPos, appleYPos)) {
          appleXPos = Math.floor(Math.random() * field.tileCount);
          appleYPos = Math.floor(Math.random() * field.tileCount);
        }
        apple = new Apple(appleXPos, appleYPos);
      }

      die() {
        this.tail = 5;
        // alive = false;
      }

      setId(id: String) {
        this.id = id;
      }

      private contains(xPos: number, yPos: number): boolean {
        for (let i = 0; i < this.trail.length; i++) {
          if (this.trail[i].xPos === xPos && this.trail[i].yPos === yPos)
            return true;
        }
        return false;
      }
    }

    let appleXPos = Math.floor(Math.random() * field.tileCount);
    let appleYPos = Math.floor(Math.random() * field.tileCount);
    apple = new Apple(appleXPos, appleYPos);

    let snakeXPos = Math.floor(Math.random() * field.tileCount);
    let snakeYPos = Math.floor(Math.random() * field.tileCount);
    snake = new Snake(snakeXPos, snakeYPos);

    function startGame() {
      // color the field
      context.fillStyle = '#424242';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // color the apple
      context.fillStyle = '#e00d0d';
      context.fillRect(
        apple.xPos * field.gridSize,
        apple.yPos * field.gridSize,
        field.gridSize - 2,
        field.gridSize - 2
      );

      snake.xPos += snake.xVel;
      snake.yPos += snake.yVel;

      if (snake.xPos < 0) snake.xPos = field.tileCount - 1; // colision with left wall
      if (snake.xPos > field.tileCount - 1) snake.xPos = 0; // colision with right wall
      if (snake.yPos < 0) snake.yPos = field.tileCount - 1; // colision with up wall
      if (snake.yPos > field.tileCount - 1) snake.yPos = 0; // colision with down wall

      // color the snake
      context.fillStyle = '#607917';
      for (let i = 0; i < snake.trail.length; i++) {
        context.fillRect(
          snake.trail[i].xPos * field.gridSize,
          snake.trail[i].yPos * field.gridSize,
          field.gridSize - 2,
          field.gridSize - 2
        );

        // colision with own body
        if (
          snake.trail[i].xPos === snake.xPos &&
          snake.trail[i].yPos === snake.yPos
        )
          snake.die();
      }
      snake.trail.push({ xPos: snake.xPos, yPos: snake.yPos });
      while (snake.trail.length > snake.tail) snake.trail.shift();

      if (apple.xPos === snake.xPos && apple.yPos === snake.yPos) snake.eat();
    }

    function keyPush(event: any) {
      switch (event.key) {
        case 'ArrowLeft':
          if (snake.xVel === 1 && snake.yVel === 0) break;
          snake.xVel = -1;
          snake.yVel = 0;
          break;
        case 'ArrowUp':
          if (snake.xVel === 0 && snake.yVel === 1) break;
          snake.xVel = 0;
          snake.yVel = -1;
          break;
        case 'ArrowRight':
          if (snake.xVel === -1 && snake.yVel === 0) break;
          snake.xVel = 1;
          snake.yVel = 0;
          break;
        case 'ArrowDown':
          if (snake.xVel === 0 && snake.yVel === -1) break;
          snake.xVel = 0;
          snake.yVel = 1;
          break;
      }
    }

    document.addEventListener('keydown', keyPush);

    connection.connectionMethods.onConnected = () => {
      snake.setId(connection.connectionId);
      connection.invoke('ConnectedSnake', JSON.stringify(snake));
    };

    connection.connectionMethods.onDisconnected = () => {
      console.log('disconnected to web socket');
    };

    connection.clientMethods['pingSnakes'] = (serializedSnakes: any) => {};

    connection.start();

    window.onunload = function () {
      connection.invoke('DisconnectedSnake', JSON.stringify(snake));
    };

    setInterval(startGame, 1000 / 12);
  }
}
