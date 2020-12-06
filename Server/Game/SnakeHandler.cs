using System;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WebSocketManager;
using WebSocketManager.Common;

namespace Server.Game
{
    public class SnakeHandler : WebSocketHandler
    {
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
            GameManager.Instance.Snakes.TryRemove(snake.Id, out snake);
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
    }
}