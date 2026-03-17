using Microsoft.EntityFrameworkCore;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;
using WeddingPlanner.Infrastructure.Data;

namespace WeddingPlanner.Infrastructure.Repositories;

public class TableRepository : ITableRepository
{
    private readonly ApplicationDbContext _context;

    public TableRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Table?> GetByIdAsync(Guid id)
    {
        return await _context.Tables
            .Include(t => t.Guests)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<List<Table>> GetByEventIdAsync(Guid eventId)
    {
        return await _context.Tables
            .Include(t => t.Guests)
            .Where(t => t.EventId == eventId)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Table> CreateAsync(Table entity)
    {
        _context.Tables.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Table entity)
    {
        _context.Tables.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Tables.FindAsync(id);
        if (entity != null)
        {
            _context.Tables.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
