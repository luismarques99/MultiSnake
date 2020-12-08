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
  connection: any;
  // TODO: Terminar apresentacao dos scores
  score: number;

  constructor(public session: SessionService, public router: Router) {
    this.connection = new WebSocketManager.Connection(
      'ws://localhost:3030/server'
    );
    this.score = 0;
  }

  ngOnInit(): void {
    this.session.me().subscribe((user) => {
      this.user = user;
      if (!this.user) {
        const options = this.session.expired
          ? { queryParams: { expired: true } }
          : undefined;
        this.router.navigate(['/login'], options);
        this.connection.invoke(
          'DisconnectedSnake',
          this.connection.connectionId,
          ''
        );
      } else {
        this.game();
      }
    });
  }

  game() {
    const canvas: any = document.querySelector('.game');
    const context: any = canvas.getContext('2d');

    const connection = this.connection;
    /* const connection = new WebSocketManager.Connection(
      'ws://localhost:3030/server'
    ); */

    const field: any = {
      gridSize: 15,
      gridMargin: 1,
      xTileCount: 40,
      yTileCount: 34,
    };
    let snake: Snake;
    let apple: Apple;
    let alive: boolean = true;
    let snakes: Snake[] = [];

    class Apple {
      xPos: number;
      yPos: number;
      points: number;

      constructor(xPos: number, yPos: number, points: number) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.points = points;
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

      eat(apple: Apple) {
        this.tail += apple.points;
      }

      die() {
        this.tail = 5;
        // alive = false;
      }

      setId(id: String) {
        this.id = id;
      }

      contains(xPos: number, yPos: number): boolean {
        for (let i = 0; i < this.trail.length; i++) {
          if (this.trail[i].xPos === xPos && this.trail[i].yPos === yPos)
            return true;
        }
        return false;
      }
    }

    let appleXPos = Math.floor(Math.random() * field.xTileCount);
    let appleYPos = Math.floor(Math.random() * field.yTileCount);
    apple = new Apple(appleXPos, appleYPos, 1);

    let snakeXPos = Math.floor(Math.random() * field.xTileCount);
    let snakeYPos = Math.floor(Math.random() * field.yTileCount);
    snake = new Snake(snakeXPos, snakeYPos);
    /* try {
      snake = new Snake(this.user.id, snakeXPos, snakeYPos);
    } catch (TypeError) {
      connection.invoke('DisconnectedSnake', connection.connectionId, '');
    } */

    function startGame() {
      // console.log(snake);
      snake.xPos += snake.xVel;
      snake.yPos += snake.yVel;

      if (snake.xPos < 0) snake.xPos = field.xTileCount - 1; // colision with left wall
      if (snake.xPos > field.xTileCount - 1) snake.xPos = 0; // colision with right wall
      if (snake.yPos < 0) snake.yPos = field.yTileCount - 1; // colision with up wall
      if (snake.yPos > field.yTileCount - 1) snake.yPos = 0; // colision with down wall

      // color the field
      context.fillStyle = '#424242';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // color the other snakes
      context.fillStyle = '#e67512';
      snakes.forEach(function (other) {
        if (other.id != snake.id) {
          for (let i = 0; i < other.trail.length; i++) {
            context.fillRect(
              other.trail[i].xPos * field.gridSize,
              other.trail[i].yPos * field.gridSize,
              field.gridSize - field.gridMargin,
              field.gridSize - field.gridMargin
            );
          }
        }
      });

      // color the apple
      context.fillStyle = '#e00d0d';
      context.fillRect(
        apple.xPos * field.gridSize,
        apple.yPos * field.gridSize,
        field.gridSize - field.gridMargin,
        field.gridSize - field.gridMargin
      );

      // color the snake
      context.fillStyle = '#607917';
      for (let i = 0; i < snake.trail.length; i++) {
        context.fillRect(
          snake.trail[i].xPos * field.gridSize,
          snake.trail[i].yPos * field.gridSize,
          field.gridSize - field.gridMargin,
          field.gridSize - field.gridMargin
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

      // move to the other snakes
      if (connection.socket.readyState == 1) {
        connection.invoke(
          'OnMove',
          connection.connectionId,
          JSON.stringify(snake)
        );
      }

      if (apple.xPos === snake.xPos && apple.yPos === snake.yPos) {
        snake.eat(apple);

        let appleXPos = Math.floor(Math.random() * field.xTileCount);
        let appleYPos = Math.floor(Math.random() * field.yTileCount);
        while (snake.contains(appleXPos, appleYPos)) {
          appleXPos = Math.floor(Math.random() * field.xTileCount);
          appleYPos = Math.floor(Math.random() * field.yTileCount);
        }
        apple = new Apple(appleXPos, appleYPos, 1);
      }
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
      connection.invoke(
        'ConnectedSnake',
        connection.connectionId,
        JSON.stringify(snake)
      );
    };

    connection.connectionMethods.onDisconnected = () => {
      connection.invoke('DisconnectedSnake', connection.connectionId, '');
    };

    connection.clientMethods['pingSnakes'] = (serializedSnakes: any) => {
      snakes = JSON.parse(serializedSnakes);
    };

    connection.start();

    window.onunload = () => {
      connection.invoke('DisconnectedSnake', connection.connectionId, '');
    };

    if (this.user == null)
      connection.invoke('DisconnectedSnake', connection.connectionId, '');

    setInterval(startGame, 1000 / 10);
  }
}
