using WeddingPlanner.Application.DTOs;

namespace WeddingPlanner.Application.Interfaces;

public interface ISeatingService
{
    Task<List<TableResponseDto>> GetTablesAsync(Guid eventId);
    Task<TableResponseDto> CreateTableAsync(Guid eventId, CreateTableDto dto);
    Task<TableResponseDto> UpdateTableAsync(Guid tableId, UpdateTableDto dto);
    Task DeleteTableAsync(Guid tableId);
    Task AssignGuestToTableAsync(AssignGuestToTableDto dto);
    Task AutoAssignSeatsAsync(Guid eventId);
}
