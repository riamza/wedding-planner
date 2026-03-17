using WeddingPlanner.Domain.Entities;

namespace WeddingPlanner.Domain.Interfaces;

public interface IPhotoRepository
{
    Task<Photo?> GetByIdAsync(Guid id);
    Task<List<Photo>> GetByEventIdAsync(Guid eventId);
    Task<Photo> CreateAsync(Photo entity);
    Task DeleteAsync(Guid id);
}
