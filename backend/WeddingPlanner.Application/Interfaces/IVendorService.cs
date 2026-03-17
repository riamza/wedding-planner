using WeddingPlanner.Application.DTOs;

namespace WeddingPlanner.Application.Interfaces;

public interface IVendorService
{
    Task<List<VendorResponseDto>> GetByEventIdAsync(Guid eventId);
    Task<VendorResponseDto> CreateAsync(Guid eventId, CreateVendorDto dto);
    Task<VendorResponseDto> UpdateAsync(Guid id, UpdateVendorDto dto);
    Task DeleteAsync(Guid id);
}
