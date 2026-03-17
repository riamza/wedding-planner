namespace WeddingPlanner.Domain.Entities;

public class Guest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RsvpStatus { get; set; } = "pending"; // "attending", "declined", "pending"
    public int AdditionalGuests { get; set; } = 0;
    public int Children { get; set; } = 0;
    public string? Category { get; set; } // "family", "friends", "coworkers", "other"
    public string? Message { get; set; }
    public string? Notes { get; set; }
    public string? InvitationToken { get; set; }
    public Guid? TableId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Event Event { get; set; } = null!;
    public Table? Table { get; set; }
}
