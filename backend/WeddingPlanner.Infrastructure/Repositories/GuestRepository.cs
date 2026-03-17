using Microsoft.EntityFrameworkCore;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;
using WeddingPlanner.Infrastructure.Data;

namespace WeddingPlanner.Infrastructure.Repositories;

public class GuestRepository : IGuestRepository
{
    private readonly ApplicationDbContext _context;

    public GuestRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guest?> GetByIdAsync(Guid id)
    {
        return await _context.Guests
            .Include(g => g.Table)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<Guest?> GetByTokenAsync(string token)
    {
        return await _context.Guests
            .Include(g => g.Table)
            .FirstOrDefaultAsync(g => g.InvitationToken == token);
    }

    public async Task<List<Guest>> GetByEventIdAsync(Guid eventId)
    {
        return await _context.Guests
            .Include(g => g.Table)
            .Where(g => g.EventId == eventId)
            .OrderBy(g => g.Name)
            .ToListAsync();
    }

    public async Task<Guest> CreateAsync(Guest entity)
    {
        _context.Guests.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Guest entity)
    {
        _context.Guests.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Guests.FindAsync(id);
        if (entity != null)
        {
            _context.Guests.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Guest>> GetUnassignedByEventIdAsync(Guid eventId)
    {
        return await _context.Guests
            .Where(g => g.EventId == eventId && g.TableId == null)
            .OrderBy(g => g.Category)
            .ThenBy(g => g.Name)
            .ToListAsync();
    }
}
