using Microsoft.AspNetCore.Mvc;
using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;

namespace WeddingPlanner.API.Controllers;

[ApiController]
[Route("api/events/{eventId:guid}/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly IVendorService _vendorService;

    public VendorsController(IVendorService vendorService)
    {
        _vendorService = vendorService;
    }

    [HttpGet]
    public async Task<ActionResult<List<VendorResponseDto>>> GetByEvent(Guid eventId)
    {
        var vendors = await _vendorService.GetByEventIdAsync(eventId);
        return Ok(vendors);
    }

    [HttpPost]
    public async Task<ActionResult<VendorResponseDto>> Create(Guid eventId, [FromBody] CreateVendorDto dto)
    {
        var result = await _vendorService.CreateAsync(eventId, dto);
        return Created("", result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<VendorResponseDto>> Update(Guid id, [FromBody] UpdateVendorDto dto)
    {
        var result = await _vendorService.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _vendorService.DeleteAsync(id);
        return NoContent();
    }
}
