using WeddingPlanner.Domain.Entities;

namespace WeddingPlanner.Domain.Interfaces;

public interface ITableRepository
{
    Task<Table?> GetByIdAsync(Guid id);
    Task<List<Table>> GetByEventIdAsync(Guid eventId);
    Task<Table> CreateAsync(Table entity);
    Task UpdateAsync(Table entity);
    Task DeleteAsync(Guid id);
}
