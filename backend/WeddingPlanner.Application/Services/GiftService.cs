using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;

namespace WeddingPlanner.Application.Services;

public class GiftService : IGiftService
{
    private readonly IGiftRepository _giftRepository;

    public GiftService(IGiftRepository giftRepository)
    {
        _giftRepository = giftRepository;
    }

    public async Task<List<GiftResponseDto>> GetByEventIdAsync(Guid eventId)
    {
        var gifts = await _giftRepository.GetByEventIdAsync(eventId);
        return gifts.Select(MapToDto).ToList();
    }

    public async Task<GiftResponseDto> CreateAsync(Guid eventId, CreateGiftDto dto)
    {
        var gift = new Gift
        {
            EventId = eventId,
            GuestName = dto.GuestName,
            Amount = dto.Amount,
            Notes = dto.Notes
        };

        var created = await _giftRepository.CreateAsync(gift);
        return MapToDto(created);
    }

    public async Task<GiftResponseDto> UpdateAsync(Guid id, UpdateGiftDto dto)
    {
        var entity = await _giftRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Gift with id {id} not found.");

        if (dto.GuestName != null) entity.GuestName = dto.GuestName;
        if (dto.Amount.HasValue) entity.Amount = dto.Amount.Value;
        if (dto.Notes != null) entity.Notes = dto.Notes;

        await _giftRepository.UpdateAsync(entity);
        return MapToDto(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _giftRepository.DeleteAsync(id);
    }

    private static GiftResponseDto MapToDto(Gift entity) => new()
    {
        Id = entity.Id,
        GuestName = entity.GuestName,
        Amount = entity.Amount,
        Notes = entity.Notes,
        CreatedAt = entity.CreatedAt
    };
}
