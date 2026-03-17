using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;

namespace WeddingPlanner.Application.Services;

public class PhotoService : IPhotoService
{
    private readonly IPhotoRepository _photoRepository;
    private readonly ICloudinaryService _cloudinaryService;

    public PhotoService(IPhotoRepository photoRepository, ICloudinaryService cloudinaryService)
    {
        _photoRepository = photoRepository;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<List<PhotoResponseDto>> GetByEventIdAsync(Guid eventId)
    {
        var photos = await _photoRepository.GetByEventIdAsync(eventId);
        return photos.Select(MapToDto).ToList();
    }

    public async Task<PhotoResponseDto> UploadAsync(
        Guid eventId, Stream fileStream, string fileName, string? uploadedBy, string? tableName)
    {
        var (url, publicId) = await _cloudinaryService.UploadImageAsync(
            fileStream, fileName, $"wedding-planner/{eventId}");

        var photo = new Photo
        {
            EventId = eventId,
            Url = url,
            PublicId = publicId,
            UploadedBy = uploadedBy,
            TableName = tableName
        };

        var created = await _photoRepository.CreateAsync(photo);
        return MapToDto(created);
    }

    public async Task DeleteAsync(Guid id)
    {
        var photo = await _photoRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Photo with id {id} not found.");

        if (!string.IsNullOrEmpty(photo.PublicId))
        {
            await _cloudinaryService.DeleteImageAsync(photo.PublicId);
        }

        await _photoRepository.DeleteAsync(id);
    }

    private static PhotoResponseDto MapToDto(Photo entity) => new()
    {
        Id = entity.Id,
        Url = entity.Url,
        UploadedBy = entity.UploadedBy,
        TableName = entity.TableName,
        CreatedAt = entity.CreatedAt
    };
}
