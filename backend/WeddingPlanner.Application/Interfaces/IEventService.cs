using WeddingPlanner.Application.DTOs;

namespace WeddingPlanner.Application.Interfaces;

public interface IEventService
{
    Task<EventResponseDto> GetByIdAsync(Guid id);
    Task<EventResponseDto> GetBySlugAsync(string slug);
    Task<List<EventResponseDto>> GetAllAsync(string? userId = null);
    Task<EventResponseDto> CreateAsync(CreateEventDto dto, string? userId = null);
    Task<EventResponseDto> UpdateAsync(Guid id, UpdateEventDto dto);
    Task DeleteAsync(Guid id);
}
