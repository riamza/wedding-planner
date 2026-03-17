namespace WeddingPlanner.Domain.Entities;

public class Vendor
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; } // "restaurant", "dj", "band", "photographer", "videographer"
    public decimal TotalPrice { get; set; }
    public decimal AdvancePaid { get; set; }
    public decimal RemainingBalance { get; set; }
    public DateTime? PaymentDueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Event Event { get; set; } = null!;
}
