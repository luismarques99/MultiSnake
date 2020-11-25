using System.ComponentModel.DataAnnotations;

namespace Server.Api.Models
{
    public class Match
    {
        [Key]
        [Required]
        public int Id { get; set; }
        
        [Required]
        public int Player1 { get; set; }
        
        [Required]
        public int Player2 { get; set; }
        
        public int Winner { get; set; }
    }
}