using WeddingPlanner.Domain.Entities;

namespace WeddingPlanner.Domain.Interfaces;

public interface IVendorRepository
{
    Task<Vendor?> GetByIdAsync(Guid id);
    Task<List<Vendor>> GetByEventIdAsync(Guid eventId);
    Task<Vendor> CreateAsync(Vendor entity);
    Task UpdateAsync(Vendor entity);
    Task DeleteAsync(Guid id);
}
