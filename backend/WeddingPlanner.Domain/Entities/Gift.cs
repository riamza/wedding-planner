namespace WeddingPlanner.Domain.Entities;

public class Gift
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Event Event { get; set; } = null!;
}
