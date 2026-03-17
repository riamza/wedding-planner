using WeddingPlanner.Domain.Entities;

namespace WeddingPlanner.Domain.Interfaces;

public interface IGiftRepository
{
    Task<Gift?> GetByIdAsync(Guid id);
    Task<List<Gift>> GetByEventIdAsync(Guid eventId);
    Task<Gift> CreateAsync(Gift entity);
    Task UpdateAsync(Gift entity);
    Task DeleteAsync(Guid id);
}
