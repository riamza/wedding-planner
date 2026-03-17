using WeddingPlanner.Domain.Entities;

namespace WeddingPlanner.Domain.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(Guid id);
    Task<Event?> GetBySlugAsync(string slug);
    Task<List<Event>> GetAllAsync();
    Task<List<Event>> GetByUserIdAsync(string userId);
    Task<Event> CreateAsync(Event entity);
    Task UpdateAsync(Event entity);
    Task DeleteAsync(Guid id);
}
