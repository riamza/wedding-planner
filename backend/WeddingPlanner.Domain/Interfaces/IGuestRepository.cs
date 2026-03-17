using WeddingPlanner.Domain.Entities;

namespace WeddingPlanner.Domain.Interfaces;

public interface IGuestRepository
{
    Task<Guest?> GetByIdAsync(Guid id);
    Task<Guest?> GetByTokenAsync(string token);
    Task<List<Guest>> GetByEventIdAsync(Guid eventId);
    Task<Guest> CreateAsync(Guest entity);
    Task UpdateAsync(Guest entity);
    Task DeleteAsync(Guid id);
    Task<List<Guest>> GetUnassignedByEventIdAsync(Guid eventId);
}
