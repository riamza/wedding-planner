using System.Text.RegularExpressions;
using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;

namespace WeddingPlanner.Application.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;

    public EventService(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<EventResponseDto> GetByIdAsync(Guid id)
    {
        var entity = await _eventRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event with id {id} not found.");
        return MapToDto(entity);
    }

    public async Task<EventResponseDto> GetBySlugAsync(string slug)
    {
        var entity = await _eventRepository.GetBySlugAsync(slug)
            ?? throw new KeyNotFoundException($"Event with slug '{slug}' not found.");
        return MapToDto(entity);
    }

    public async Task<List<EventResponseDto>> GetAllAsync(string? userId = null)
    {
        var entities = string.IsNullOrEmpty(userId)
            ? await _eventRepository.GetAllAsync()
            : await _eventRepository.GetByUserIdAsync(userId);

        return entities.Select(MapToDto).ToList();
    }

    public async Task<EventResponseDto> CreateAsync(CreateEventDto dto, string? userId = null)
    {
        var slug = GenerateSlug(dto.BrideName, dto.GroomName);
        var existing = await _eventRepository.GetBySlugAsync(slug);
        if (existing != null)
        {
            slug += "-" + Guid.NewGuid().ToString()[..6];
        }

        var entity = new Event
        {
            BrideName = dto.BrideName,
            BrideMotherName = dto.BrideMotherName,
            BrideFatherName = dto.BrideFatherName,
            GroomName = dto.GroomName,
            GroomMotherName = dto.GroomMotherName,
            GroomFatherName = dto.GroomFatherName,
            GodmotherName = dto.GodmotherName,
            GodfatherName = dto.GodfatherName,
            EventDate = dto.EventDate,
            Location = dto.Location,
            Schedule = dto.Schedule,
            InvitationMessage = dto.InvitationMessage,
            TemplateName = dto.TemplateName,
            Slug = slug,
            InvitationMode = dto.InvitationMode,
            SelectedPackage = dto.SelectedPackage,
            UserId = userId
        };

        var created = await _eventRepository.CreateAsync(entity);
        return MapToDto(created);
    }

    public async Task<EventResponseDto> UpdateAsync(Guid id, UpdateEventDto dto)
    {
        var entity = await _eventRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event with id {id} not found.");

        if (dto.BrideName != null) entity.BrideName = dto.BrideName;
        if (dto.BrideMotherName != null) entity.BrideMotherName = dto.BrideMotherName;
        if (dto.BrideFatherName != null) entity.BrideFatherName = dto.BrideFatherName;
        if (dto.GroomName != null) entity.GroomName = dto.GroomName;
        if (dto.GroomMotherName != null) entity.GroomMotherName = dto.GroomMotherName;
        if (dto.GroomFatherName != null) entity.GroomFatherName = dto.GroomFatherName;
        if (dto.GodmotherName != null) entity.GodmotherName = dto.GodmotherName;
        if (dto.GodfatherName != null) entity.GodfatherName = dto.GodfatherName;
        if (dto.EventDate.HasValue) entity.EventDate = dto.EventDate.Value;
        if (dto.Location != null) entity.Location = dto.Location;
        if (dto.Schedule != null) entity.Schedule = dto.Schedule;
        if (dto.InvitationMessage != null) entity.InvitationMessage = dto.InvitationMessage;
        if (dto.TemplateName != null) entity.TemplateName = dto.TemplateName;
        if (dto.InvitationMode != null) entity.InvitationMode = dto.InvitationMode;
        if (dto.SelectedPackage != null) entity.SelectedPackage = dto.SelectedPackage;
        if (dto.CustomGroups != null) entity.CustomGroups = dto.CustomGroups;

        await _eventRepository.UpdateAsync(entity);
        return MapToDto(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _eventRepository.DeleteAsync(id);
    }

    private static string GenerateSlug(string brideName, string groomName)
    {
        var raw = $"{brideName}-{groomName}".ToLowerInvariant();
        var slug = Regex.Replace(raw, @"[^a-z0-9\-]", " ".Trim());
        slug = Regex.Replace(slug, @"-+", "-").Trim('-');
        var shortId = Guid.NewGuid().ToString("N")[..6]; 
        return $"{slug}-{shortId}";
    }

    private static EventResponseDto MapToDto(Event entity) => new()
    {
        Id = entity.Id,
        BrideName = entity.BrideName,
        BrideMotherName = entity.BrideMotherName,
        BrideFatherName = entity.BrideFatherName,
        GroomName = entity.GroomName,
        GroomMotherName = entity.GroomMotherName,
        GroomFatherName = entity.GroomFatherName,
        GodmotherName = entity.GodmotherName,
        GodfatherName = entity.GodfatherName,
        EventDate = entity.EventDate,
        Location = entity.Location,
        Schedule = entity.Schedule,
        InvitationMessage = entity.InvitationMessage,
        TemplateName = entity.TemplateName,
        Slug = entity.Slug,
        InvitationMode = entity.InvitationMode,
        SelectedPackage = entity.SelectedPackage,
        CreatedAt = entity.CreatedAt,
        CustomGroups = entity.CustomGroups
    };
}
