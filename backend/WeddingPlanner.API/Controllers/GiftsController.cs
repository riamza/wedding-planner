using Microsoft.AspNetCore.Mvc;
using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;

namespace WeddingPlanner.API.Controllers;

[ApiController]
[Route("api/events/{eventId:guid}/[controller]")]
public class GiftsController : ControllerBase
{
    private readonly IGiftService _giftService;

    public GiftsController(IGiftService giftService)
    {
        _giftService = giftService;
    }

    [HttpGet]
    public async Task<ActionResult<List<GiftResponseDto>>> GetByEvent(Guid eventId)
    {
        var gifts = await _giftService.GetByEventIdAsync(eventId);
        return Ok(gifts);
    }

    [HttpPost]
    public async Task<ActionResult<GiftResponseDto>> Create(Guid eventId, [FromBody] CreateGiftDto dto)
    {
        var result = await _giftService.CreateAsync(eventId, dto);
        return Created("", result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<GiftResponseDto>> Update(Guid id, [FromBody] UpdateGiftDto dto)
    {
        var result = await _giftService.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _giftService.DeleteAsync(id);
        return NoContent();
    }
}
