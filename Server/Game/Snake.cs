using Newtonsoft.Json;

namespace Server.Game
{
    public class Snake
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("xPos")]
        public int XPos { get; set; }
        [JsonProperty("yPos")]
        public int YPos { get; set; }
        [JsonProperty("tail")]
        public int Tail { get; set; }
        [JsonProperty("trail")]
        public object[] Trail { get; set; }
    }
}