using WeddingPlanner.Application.DTOs;

namespace WeddingPlanner.Application.Interfaces;

public interface IGiftService
{
    Task<List<GiftResponseDto>> GetByEventIdAsync(Guid eventId);
    Task<GiftResponseDto> CreateAsync(Guid eventId, CreateGiftDto dto);
    Task<GiftResponseDto> UpdateAsync(Guid id, UpdateGiftDto dto);
    Task DeleteAsync(Guid id);
}
