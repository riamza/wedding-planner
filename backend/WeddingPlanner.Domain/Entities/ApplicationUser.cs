using Microsoft.AspNetCore.Identity;

namespace WeddingPlanner.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}