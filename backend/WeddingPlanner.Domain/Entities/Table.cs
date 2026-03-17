namespace WeddingPlanner.Domain.Entities;

public class Table
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Seats { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Event Event { get; set; } = null!;
    public ICollection<Guest> Guests { get; set; } = new List<Guest>();
}
