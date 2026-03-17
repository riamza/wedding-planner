using Microsoft.EntityFrameworkCore;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;
using WeddingPlanner.Infrastructure.Data;

namespace WeddingPlanner.Infrastructure.Repositories;

public class GiftRepository : IGiftRepository
{
    private readonly ApplicationDbContext _context;

    public GiftRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Gift?> GetByIdAsync(Guid id)
    {
        return await _context.Gifts.FindAsync(id);
    }

    public async Task<List<Gift>> GetByEventIdAsync(Guid eventId)
    {
        return await _context.Gifts
            .Where(g => g.EventId == eventId)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();
    }

    public async Task<Gift> CreateAsync(Gift entity)
    {
        _context.Gifts.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Gift entity)
    {
        _context.Gifts.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Gifts.FindAsync(id);
        if (entity != null)
        {
            _context.Gifts.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
