using Microsoft.EntityFrameworkCore;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;
using WeddingPlanner.Infrastructure.Data;

namespace WeddingPlanner.Infrastructure.Repositories;

public class EventRepository : IEventRepository
{
    private readonly ApplicationDbContext _context;

    public EventRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Event?> GetByIdAsync(Guid id)
    {
        return await _context.Events.FindAsync(id);
    }

    public async Task<Event?> GetBySlugAsync(string slug)
    {
        return await _context.Events.FirstOrDefaultAsync(e => e.Slug == slug);
    }

    public async Task<List<Event>> GetAllAsync()
    {
        return await _context.Events.OrderByDescending(e => e.CreatedAt).ToListAsync();
    }

    public async Task<List<Event>> GetByUserIdAsync(string userId)
    {
        return await _context.Events
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<Event> CreateAsync(Event entity)
    {
        _context.Events.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Event entity)
    {
        _context.Events.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Events.FindAsync(id);
        if (entity != null)
        {
            _context.Events.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
