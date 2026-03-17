using WeddingPlanner.Application.DTOs;

namespace WeddingPlanner.Application.Interfaces;

public interface IGuestService
{
    Task<GuestResponseDto> GetByIdAsync(Guid id);
    Task<List<GuestResponseDto>> GetByEventIdAsync(Guid eventId);
    Task<GuestResponseDto> AddGuestAsync(Guid eventId, CreateGuestDto dto);
    Task<GuestResponseDto> UpdateGuestAsync(Guid id, UpdateGuestDto dto);
    Task DeleteGuestAsync(Guid id);
    Task<GuestResponseDto> GetGuestByTokenAsync(string token);
    Task<GuestResponseDto> SubmitRsvpAsync(Guid eventId, RsvpSubmitDto dto);
    Task<GuestResponseDto> SubmitRsvpByTokenAsync(string token, RsvpSubmitDto dto);
    Task<GuestStatsDto> GetStatsAsync(Guid eventId);
    Task<TableLookupDto> LookupTableAsync(Guid eventId, string guestName);
}
