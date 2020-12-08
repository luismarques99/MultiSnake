using System.Collections.Concurrent;
using System.Threading;
using Newtonsoft.Json;
using Server.Api.Helpers;

namespace Server.Game
{
    public class GameManager
    {
        private static GameManager _instance;
        private static readonly object PadLock = new object();
        public ConcurrentDictionary<string, Snake> Snakes { get; set; }
        public Timer Timer;

        public static GameManager Instance
        {
            get
            {
                lock (PadLock)
                {
                    return _instance ??= new GameManager();
                }
            }
        }

        public void Initialize()
        {
            Snakes = new ConcurrentDictionary<string, Snake>();
            Timer = new Timer(Callback, null, 0, 1000 / 60);
        }

        private void Callback(object state)
        {
            var listOfSnakes = JsonConvert.SerializeObject(Snakes.Values);
            Startup.SnakeHandler.InvokeClientMethodToAllAsync("pingSnakes", listOfSnakes).Wait();
        }
    }
}