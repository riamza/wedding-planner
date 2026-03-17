using Microsoft.AspNetCore.Mvc;
using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;

namespace WeddingPlanner.API.Controllers;

[ApiController]
[Route("api/events/{eventId:guid}/[controller]")]
public class GuestsController : ControllerBase
{
    private readonly IGuestService _guestService;

    public GuestsController(IGuestService guestService)
    {
        _guestService = guestService;
    }

    [HttpGet]
    public async Task<ActionResult<List<GuestResponseDto>>> GetByEvent(Guid eventId)
    {
        var guests = await _guestService.GetByEventIdAsync(eventId);
        return Ok(guests);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GuestResponseDto>> GetById(Guid id)
    {
        var result = await _guestService.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<GuestResponseDto>> AddGuest(Guid eventId, [FromBody] CreateGuestDto dto)
    {
        var result = await _guestService.AddGuestAsync(eventId, dto);
        return CreatedAtAction(nameof(GetById), new { eventId, id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<GuestResponseDto>> UpdateGuest(Guid id, [FromBody] UpdateGuestDto dto)
    {
        var result = await _guestService.UpdateGuestAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteGuest(Guid id)
    {
        await _guestService.DeleteGuestAsync(id);
        return NoContent();
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<GuestResponseDto>> UpdateStatus(Guid id, [FromBody] UpdateGuestDto dto)
    {
        var result = await _guestService.UpdateGuestAsync(id, dto);
        return Ok(result);
    }

    [HttpPost("rsvp")]
    public async Task<ActionResult<GuestResponseDto>> SubmitRsvp(Guid eventId, [FromBody] RsvpSubmitDto dto)
    {
        var result = await _guestService.SubmitRsvpAsync(eventId, dto);
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<GuestStatsDto>> GetStats(Guid eventId)
    {
        var result = await _guestService.GetStatsAsync(eventId);
        return Ok(result);
    }

    [HttpGet("lookup")]
    public async Task<ActionResult<TableLookupDto>> LookupTable(Guid eventId, [FromQuery] string name)
    {
        var result = await _guestService.LookupTableAsync(eventId, name);
        return Ok(result);
    }
}

[ApiController]
[Route("api/rsvp")]
public class RsvpController : ControllerBase
{
    private readonly IGuestService _guestService;

    public RsvpController(IGuestService guestService)
    {
        _guestService = guestService;
    }
      [HttpGet("{token}")]
      public async Task<ActionResult<GuestResponseDto>> GetByToken(string token)
      {
          try {
              var result = await _guestService.GetGuestByTokenAsync(token);
              return Ok(result);
          } catch {
              return NotFound();
          }
      }
    [HttpPost("{token}")]
    public async Task<ActionResult<GuestResponseDto>> SubmitByToken(string token, [FromBody] RsvpSubmitDto dto)
    {
        var result = await _guestService.SubmitRsvpByTokenAsync(token, dto);
        return Ok(result);
    }
}
