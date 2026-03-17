using WeddingPlanner.Application.DTOs;

namespace WeddingPlanner.Application.Interfaces;

public interface IPhotoService
{
    Task<List<PhotoResponseDto>> GetByEventIdAsync(Guid eventId);
    Task<PhotoResponseDto> UploadAsync(Guid eventId, Stream fileStream, string fileName, string? uploadedBy, string? tableName);
    Task DeleteAsync(Guid id);
}
