using Microsoft.EntityFrameworkCore;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;
using WeddingPlanner.Infrastructure.Data;

namespace WeddingPlanner.Infrastructure.Repositories;

public class VendorRepository : IVendorRepository
{
    private readonly ApplicationDbContext _context;

    public VendorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Vendor?> GetByIdAsync(Guid id)
    {
        return await _context.Vendors.FindAsync(id);
    }

    public async Task<List<Vendor>> GetByEventIdAsync(Guid eventId)
    {
        return await _context.Vendors
            .Where(v => v.EventId == eventId)
            .OrderBy(v => v.Name)
            .ToListAsync();
    }

    public async Task<Vendor> CreateAsync(Vendor entity)
    {
        _context.Vendors.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Vendor entity)
    {
        _context.Vendors.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Vendors.FindAsync(id);
        if (entity != null)
        {
            _context.Vendors.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
