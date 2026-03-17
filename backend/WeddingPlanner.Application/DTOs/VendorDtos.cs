namespace WeddingPlanner.Application.DTOs;

public class CreateVendorDto
{
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal AdvancePaid { get; set; }
    public DateTime? PaymentDueDate { get; set; }
}

public class UpdateVendorDto
{
    public string? Name { get; set; }
    public string? Type { get; set; }
    public decimal? TotalPrice { get; set; }
    public decimal? AdvancePaid { get; set; }
    public DateTime? PaymentDueDate { get; set; }
}

public class VendorResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal AdvancePaid { get; set; }
    public decimal RemainingBalance { get; set; }
    public DateTime? PaymentDueDate { get; set; }
}
