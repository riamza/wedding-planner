using Microsoft.AspNetCore.Mvc;
using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;

namespace WeddingPlanner.API.Controllers;

[ApiController]
[Route("api/events/{eventId:guid}/[controller]")]
public class SeatingController : ControllerBase
{
    private readonly ISeatingService _seatingService;

    public SeatingController(ISeatingService seatingService)
    {
        _seatingService = seatingService;
    }

    [HttpGet("tables")]
    public async Task<ActionResult<List<TableResponseDto>>> GetTables(Guid eventId)
    {
        var tables = await _seatingService.GetTablesAsync(eventId);
        return Ok(tables);
    }

    [HttpPost("tables")]
    public async Task<ActionResult<TableResponseDto>> CreateTable(Guid eventId, [FromBody] CreateTableDto dto)
    {
        var result = await _seatingService.CreateTableAsync(eventId, dto);
        return CreatedAtAction(nameof(GetTables), new { eventId }, result);
    }

    [HttpPut("tables/{tableId:guid}")]
    public async Task<ActionResult<TableResponseDto>> UpdateTable(Guid tableId, [FromBody] UpdateTableDto dto)
    {
        var result = await _seatingService.UpdateTableAsync(tableId, dto);
        return Ok(result);
    }

    [HttpDelete("tables/{tableId:guid}")]
    public async Task<ActionResult> DeleteTable(Guid tableId)
    {
        await _seatingService.DeleteTableAsync(tableId);
        return NoContent();
    }

    [HttpPost("assign")]
    public async Task<ActionResult> AssignGuest([FromBody] AssignGuestToTableDto dto)
    {
        await _seatingService.AssignGuestToTableAsync(dto);
        return Ok();
    }

    [HttpPost("auto-assign")]
    public async Task<ActionResult> AutoAssign(Guid eventId)
    {
        await _seatingService.AutoAssignSeatsAsync(eventId);
        return Ok();
    }
}
