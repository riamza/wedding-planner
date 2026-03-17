namespace WeddingPlanner.Application.DTOs;

public class PhotoResponseDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? UploadedBy { get; set; }
    public string? TableName { get; set; }
    public DateTime CreatedAt { get; set; }
}
