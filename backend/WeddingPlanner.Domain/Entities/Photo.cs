namespace WeddingPlanner.Domain.Entities;

public class Photo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? PublicId { get; set; }
    public string? UploadedBy { get; set; }
    public string? TableName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Event Event { get; set; } = null!;
}
