using Microsoft.EntityFrameworkCore;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;
using WeddingPlanner.Infrastructure.Data;

namespace WeddingPlanner.Infrastructure.Repositories;

public class PhotoRepository : IPhotoRepository
{
    private readonly ApplicationDbContext _context;

    public PhotoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Photo?> GetByIdAsync(Guid id)
    {
        return await _context.Photos.FindAsync(id);
    }

    public async Task<List<Photo>> GetByEventIdAsync(Guid eventId)
    {
        return await _context.Photos
            .Where(p => p.EventId == eventId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Photo> CreateAsync(Photo entity)
    {
        _context.Photos.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Photos.FindAsync(id);
        if (entity != null)
        {
            _context.Photos.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
