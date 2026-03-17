using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;

namespace WeddingPlanner.Application.Services;

public class VendorService : IVendorService
{
    private readonly IVendorRepository _vendorRepository;

    public VendorService(IVendorRepository vendorRepository)
    {
        _vendorRepository = vendorRepository;
    }

    public async Task<List<VendorResponseDto>> GetByEventIdAsync(Guid eventId)
    {
        var vendors = await _vendorRepository.GetByEventIdAsync(eventId);
        return vendors.Select(MapToDto).ToList();
    }

    public async Task<VendorResponseDto> CreateAsync(Guid eventId, CreateVendorDto dto)
    {
        var vendor = new Vendor
        {
            EventId = eventId,
            Name = dto.Name,
            Type = dto.Type,
            TotalPrice = dto.TotalPrice,
            AdvancePaid = dto.AdvancePaid,
            RemainingBalance = dto.TotalPrice - dto.AdvancePaid,
            PaymentDueDate = dto.PaymentDueDate
        };

        var created = await _vendorRepository.CreateAsync(vendor);
        return MapToDto(created);
    }

    public async Task<VendorResponseDto> UpdateAsync(Guid id, UpdateVendorDto dto)
    {
        var entity = await _vendorRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Vendor with id {id} not found.");

        if (dto.Name != null) entity.Name = dto.Name;
        if (dto.Type != null) entity.Type = dto.Type;
        if (dto.TotalPrice.HasValue) entity.TotalPrice = dto.TotalPrice.Value;
        if (dto.AdvancePaid.HasValue) entity.AdvancePaid = dto.AdvancePaid.Value;
        if (dto.PaymentDueDate.HasValue) entity.PaymentDueDate = dto.PaymentDueDate.Value;

        entity.RemainingBalance = entity.TotalPrice - entity.AdvancePaid;

        await _vendorRepository.UpdateAsync(entity);
        return MapToDto(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _vendorRepository.DeleteAsync(id);
    }

    private static VendorResponseDto MapToDto(Vendor entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Type = entity.Type,
        TotalPrice = entity.TotalPrice,
        AdvancePaid = entity.AdvancePaid,
        RemainingBalance = entity.RemainingBalance,
        PaymentDueDate = entity.PaymentDueDate
    };
}
