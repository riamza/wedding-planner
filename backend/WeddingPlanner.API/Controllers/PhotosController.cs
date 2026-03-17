using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.API.Hubs;

namespace WeddingPlanner.API.Controllers;

[ApiController]
[Route("api/events/{eventId:guid}/[controller]")]
public class PhotosController : ControllerBase
{
    private readonly IPhotoService _photoService;
    private readonly IHubContext<GalleryHub> _hubContext;

    public PhotosController(IPhotoService photoService, IHubContext<GalleryHub> hubContext)
    {
        _photoService = photoService;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<PhotoResponseDto>>> GetByEvent(Guid eventId)
    {
        var photos = await _photoService.GetByEventIdAsync(eventId);
        return Ok(photos);
    }

    [HttpPost]
    public async Task<ActionResult<PhotoResponseDto>> Upload(
        Guid eventId,
        [FromForm] IFormFile file,
        [FromForm] string? uploadedBy,
        [FromForm] string? tableName)
    {
        using var stream = file.OpenReadStream();
        var result = await _photoService.UploadAsync(eventId, stream, file.FileName, uploadedBy, tableName);

        await _hubContext.Clients.Group($"gallery-{eventId}")
            .SendAsync("NewPhoto", result);

        return Created("", result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid eventId, Guid id)
    {
        await _photoService.DeleteAsync(id);

        await _hubContext.Clients.Group($"gallery-{eventId}")
            .SendAsync("PhotoDeleted", id);

        return NoContent();
    }
}
