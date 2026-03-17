using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;

namespace WeddingPlanner.Application.Services;

public class GuestService : IGuestService
{
    private readonly IGuestRepository _guestRepository;
    private readonly IEventRepository _eventRepository;

    public GuestService(IGuestRepository guestRepository, IEventRepository eventRepository)
    {
        _guestRepository = guestRepository;
        _eventRepository = eventRepository;
    }

    public async Task<GuestResponseDto> GetByIdAsync(Guid id)
    {
        var entity = await _guestRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Guest with id {id} not found.");
        return MapToDto(entity);
    }

    public async Task<List<GuestResponseDto>> GetByEventIdAsync(Guid eventId)
    {
        var guests = await _guestRepository.GetByEventIdAsync(eventId);
        return guests.Select(MapToDto).ToList();
    }

    public async Task<GuestResponseDto> AddGuestAsync(Guid eventId, CreateGuestDto dto)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId)
            ?? throw new KeyNotFoundException($"Event with id {eventId} not found.");

var tokenBase = System.Text.RegularExpressions.Regex.Replace(dto.Name.ToLower().Trim(), @"[^a-z0-9\s-]", "");
          tokenBase = System.Text.RegularExpressions.Regex.Replace(tokenBase, @"\s+", "-");
          if (string.IsNullOrEmpty(tokenBase)) tokenBase = "invitat";
          var token = $"{tokenBase}-{new Random().Next(1000, 9999)}";

          var guest = new Guest
          {
              EventId = eventId,
              Name = dto.Name,
              Category = dto.Category,
              InvitationToken = token
        };

        var created = await _guestRepository.CreateAsync(guest);
        return MapToDto(created);
    }

    public async Task<GuestResponseDto> UpdateGuestAsync(Guid id, UpdateGuestDto dto)
    {
        var entity = await _guestRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Guest with id {id} not found.");

        if (dto.Name != null) entity.Name = dto.Name;
        if (dto.RsvpStatus != null) entity.RsvpStatus = dto.RsvpStatus;
        if (dto.AdditionalGuests.HasValue) entity.AdditionalGuests = dto.AdditionalGuests.Value;
        if (dto.Children.HasValue) entity.Children = dto.Children.Value;
        if (dto.Category != null) entity.Category = dto.Category;
        if (dto.Message != null) entity.Message = dto.Message;
        if (dto.Notes != null) entity.Notes = dto.Notes;
        if (dto.TableId.HasValue) entity.TableId = dto.TableId.Value == Guid.Empty ? null : dto.TableId.Value;

        await _guestRepository.UpdateAsync(entity);
        return MapToDto(entity);
    }

    public async Task DeleteGuestAsync(Guid id)
    {
        await _guestRepository.DeleteAsync(id);
    }

    public async Task<GuestResponseDto> SubmitRsvpAsync(Guid eventId, RsvpSubmitDto dto)
    {
        var guests = await _guestRepository.GetByEventIdAsync(eventId);
        var existing = guests.FirstOrDefault(g =>
            g.Name.Equals(dto.Name, StringComparison.OrdinalIgnoreCase));

        if (existing != null)
        {
            existing.RsvpStatus = dto.RsvpStatus;
            existing.AdditionalGuests = dto.AdditionalGuests;
            existing.Children = dto.Children;
            existing.Message = dto.Message;
            existing.Notes = dto.Notes;
            await _guestRepository.UpdateAsync(existing);
            return MapToDto(existing);
        }

        var guest = new Guest
        {
            EventId = eventId,
            Name = dto.Name,
            RsvpStatus = dto.RsvpStatus,
            AdditionalGuests = dto.AdditionalGuests,
            Children = dto.Children,
            Message = dto.Message,
            Notes = dto.Notes
        };

        var created = await _guestRepository.CreateAsync(guest);
        return MapToDto(created);
    }
      public async Task<GuestResponseDto> GetGuestByTokenAsync(string token)
      {
          var guest = await _guestRepository.GetByTokenAsync(token)      
              ?? throw new KeyNotFoundException($"Invalid invitation token.");
          
          return MapToDto(guest);
      }
    public async Task<GuestResponseDto> SubmitRsvpByTokenAsync(string token, RsvpSubmitDto dto)
    {
        var guest = await _guestRepository.GetByTokenAsync(token)
            ?? throw new KeyNotFoundException($"Invalid invitation token.");

        guest.RsvpStatus = dto.RsvpStatus;
        guest.AdditionalGuests = dto.AdditionalGuests;
        guest.Children = dto.Children;
        guest.Message = dto.Message;
        guest.Notes = dto.Notes;

        await _guestRepository.UpdateAsync(guest);
        return MapToDto(guest);
    }

    public async Task<GuestStatsDto> GetStatsAsync(Guid eventId)
    {
        var guests = await _guestRepository.GetByEventIdAsync(eventId);

        return new GuestStatsDto
        {
            TotalInvited = guests.Count,
            Confirmed = guests.Count(g => g.RsvpStatus == "attending"),
            Declined = guests.Count(g => g.RsvpStatus == "declined"),
            Pending = guests.Count(g => g.RsvpStatus == "pending"),
            TotalAttending = guests
                .Where(g => g.RsvpStatus == "attending")
                .Sum(g => 1 + g.AdditionalGuests),
            TotalChildren = guests
                .Where(g => g.RsvpStatus == "attending")
                .Sum(g => g.Children)
        };
    }

    public async Task<TableLookupDto> LookupTableAsync(Guid eventId, string guestName)
    {
        var guests = await _guestRepository.GetByEventIdAsync(eventId);
        var guest = guests.FirstOrDefault(g =>
            g.Name.Equals(guestName, StringComparison.OrdinalIgnoreCase));

        if (guest == null)
        {
            return new TableLookupDto { GuestName = guestName, Found = false };
        }

        return new TableLookupDto
        {
            GuestName = guest.Name,
            TableName = guest.Table?.Name,
            Found = true
        };
    }

    private static string GenerateToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray())
            .Replace("/", "_").Replace("+", "-")[..22];
    }

    private static GuestResponseDto MapToDto(Guest entity) => new()
    {
        Id = entity.Id,
        EventId = entity.EventId,
        Name = entity.Name,
        RsvpStatus = entity.RsvpStatus,
        AdditionalGuests = entity.AdditionalGuests,
        Children = entity.Children,
        Category = entity.Category,
        Message = entity.Message,
        Notes = entity.Notes,
        InvitationToken = entity.InvitationToken,
        TableId = entity.TableId,
        TableName = entity.Table?.Name,
        CreatedAt = entity.CreatedAt
    };
}
