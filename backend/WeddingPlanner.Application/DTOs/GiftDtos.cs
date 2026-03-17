namespace WeddingPlanner.Application.DTOs;

public class CreateGiftDto
{
    public string GuestName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
}

public class UpdateGiftDto
{
    public string? GuestName { get; set; }
    public decimal? Amount { get; set; }
    public string? Notes { get; set; }
}

public class GiftResponseDto
{
    public Guid Id { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
