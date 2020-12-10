using System;
using Newtonsoft.Json;

namespace Server.Game
{
    public class Apple
    {
        private readonly Random _random = new Random();

        [JsonProperty("xPos")] public int XPos { get; set; }

        [JsonProperty("yPos")] public int YPos { get; set; }

        [JsonProperty("points")] public int Points { get; set; }

        public Apple(int xPos, int yPos)
        {
            XPos = xPos;
            YPos = yPos;
            var goldenApple = _random.Next(1, 11);
            Points = goldenApple == 10 ? 5 : 1;
        }
    }
}