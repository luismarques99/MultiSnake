using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using Newtonsoft.Json;

namespace Server.Game
{
    public class GameManager
    {
        private static GameManager _instance;
        private static readonly object PadLock = new object();
        // private readonly Random _random = new Random();
        public ConcurrentDictionary<string, Snake> Snakes { get; set; }
        // public List<Apple> Apples { get; set; }
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
            Timer = new Timer(Callback, null, 0, 1000 / 10);
            Snakes = new ConcurrentDictionary<string, Snake>();
            /*Apples = new List<Apple>();

             const int numberOfApples = 3;
             const int fieldXTiles = 40;
             const int fieldYTiles = 34;
             
             for (var i = 0; i < numberOfApples; i++)
             {
                 var appleXPos = _random.Next(0, fieldXTiles);
                 var appleYPos = _random.Next(0, fieldYTiles);
                 while (ContainsApple(new Apple(appleXPos, appleYPos)))
                 {
                     appleXPos = _random.Next(0, fieldXTiles);
                     appleYPos = _random.Next(0, fieldYTiles);
                 }

                 var apple = new Apple(appleXPos, appleYPos);
                 Apples.Add(apple);
             }*/
        }

        private void Callback(object state)
        {
            var listOfSnakes = JsonConvert.SerializeObject(Snakes.Values);
            Startup.SnakeHandler.InvokeClientMethodToAllAsync("pingSnakes", listOfSnakes).Wait();
            
            // var listOfApples = JsonConvert.SerializeObject(Apples);
            // Startup.SnakeHandler.InvokeClientMethodToAllAsync("pingApples", listOfApples).Wait();
        }
        
        /*private bool ContainsApple(Apple apple)
        {
            foreach (var other in Apples)
            {
                if (apple.XPos == other.XPos && apple.YPos == other.YPos) return true;
            }
            return false;
        }*/
    }
}