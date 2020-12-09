using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WebSocketManager;
using WebSocketManager.Common;

namespace Server.Game
{
    public class SnakeHandler : WebSocketHandler
    {
        private readonly Random _random = new Random();
        private ConcurrentDictionary<string, Snake> _snakes = GameManager.Instance.Snakes;
        // private List<Apple> _apples = GameManager.Instance.Apples;

        public SnakeHandler(WebSocketConnectionManager webSocketConnectionManager) : base(webSocketConnectionManager)
        {
        }

        public async Task ConnectedSnake(string serializedSnake)
        {
            var snake = JsonConvert.DeserializeObject<Snake>(serializedSnake);
            var exists = GameManager.Instance.Snakes.ContainsKey(snake.Id);

            if (!exists) GameManager.Instance.Snakes.TryAdd(snake.Id, snake);
        }

        public async Task DisconnectedSnake(string serializedSnake)
        {
            var snake = JsonConvert.DeserializeObject<Snake>(serializedSnake);
            GameManager.Instance.Snakes.TryRemove(snake.Id, out var removedSnake);
        }

        public async Task OnMove(string serializedSnake)
        {
            var snake = JsonConvert.DeserializeObject<Snake>(serializedSnake);
            GameManager.Instance.Snakes.TryGetValue(snake.Id, out Snake exists);
            if (exists != null)
            {
                exists.XPos = snake.XPos;
                exists.YPos = snake.YPos;
                exists.Tail = snake.Tail;
                exists.Trail = snake.Trail;
            }
        }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);

            var socketId = WebSocketConnectionManager.GetId(socket);

            var message = new Message
            {
                MessageType = MessageType.Text,
                Data = $"Snake with socket id '{socketId}' is now connected!"
            };

            await SendMessageToAllAsync(message);
        }

        public override async Task OnDisconnected(WebSocket socket)
        {
            await base.OnDisconnected(socket);

            var socketId = WebSocketConnectionManager.GetId(socket);

            var message = new Message
            {
                MessageType = MessageType.Text,
                Data = $"Snake with socket id '{socketId}' is now disconnected!"
            };

            await SendMessageToAllAsync(message);
        }

        /*public async Task InitializeApples(int numOfApples, int fieldXTiles, int fieldYTiles)
        {
            for (var i = 0; i < numOfApples; i++)
            {
                var appleXPos = _random.Next(0, fieldXTiles);
                var appleYPos = _random.Next(0, fieldYTiles);
                while (ContainsApple(new Apple(appleXPos, appleYPos)))
                {
                    appleXPos = _random.Next(0, fieldXTiles);
                    appleYPos = _random.Next(0, fieldYTiles);
                }

                var apple = new Apple(appleXPos, appleYPos);
                _apples.Add(apple);
            }
        }

        public async Task AppleEaten(string serializedApple, int fieldXTiles, int fieldYTiles)
        {
            var apple = JsonConvert.DeserializeObject<Apple>(serializedApple);
            _apples.Remove(apple);    

            var appleXPos = _random.Next(0, fieldXTiles);
            var appleYPos = _random.Next(0, fieldYTiles);
            while (ContainsApple(new Apple(appleXPos, appleYPos)))
            {
                appleXPos = _random.Next(0, fieldXTiles);
                appleYPos = _random.Next(0, fieldYTiles);
            }

            var newApple = new Apple(appleXPos, appleYPos);
            _apples.Add(newApple);
        }

        private bool ContainsApple(Apple apple)
        {
            foreach (var other in _apples)
            {
                if (apple.XPos == other.XPos && apple.YPos == other.YPos) return true;
            }

            return false;
        }*/
    }
}