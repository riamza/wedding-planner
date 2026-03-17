using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;

namespace WeddingPlanner.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<ActionResult<List<EventResponseDto>>> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var events = await _eventService.GetAllAsync(userId);
        return Ok(events);
    }

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EventResponseDto>> GetById(Guid id)
    {
        var result = await _eventService.GetByIdAsync(id);
        return Ok(result);
    }
    [AllowAnonymous]    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<EventResponseDto>> GetBySlug(string slug)
    {
        var result = await _eventService.GetBySlugAsync(slug);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<EventResponseDto>> Create([FromBody] CreateEventDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await _eventService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EventResponseDto>> Update(Guid id, [FromBody] UpdateEventDto dto)
    {
        var result = await _eventService.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _eventService.DeleteAsync(id);
        return NoContent();
    }
}
