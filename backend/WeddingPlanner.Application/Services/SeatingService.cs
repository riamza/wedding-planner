using WeddingPlanner.Application.DTOs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;

namespace WeddingPlanner.Application.Services;

public class SeatingService : ISeatingService
{
    private readonly ITableRepository _tableRepository;
    private readonly IGuestRepository _guestRepository;

    public SeatingService(ITableRepository tableRepository, IGuestRepository guestRepository)
    {
        _tableRepository = tableRepository;
        _guestRepository = guestRepository;
    }

    public async Task<List<TableResponseDto>> GetTablesAsync(Guid eventId)
    {
        var tables = await _tableRepository.GetByEventIdAsync(eventId);
        return tables.Select(MapToDto).ToList();
    }

    public async Task<TableResponseDto> CreateTableAsync(Guid eventId, CreateTableDto dto)
    {
        var table = new Table
        {
            EventId = eventId,
            Name = dto.Name,
            Seats = dto.Seats
        };

        var created = await _tableRepository.CreateAsync(table);
        return MapToDto(created);
    }

    public async Task<TableResponseDto> UpdateTableAsync(Guid tableId, UpdateTableDto dto)
    {
        var entity = await _tableRepository.GetByIdAsync(tableId)
            ?? throw new KeyNotFoundException("Table with id {tableId} not found.");

        if (dto.Name != null) entity.Name = dto.Name;
        if (dto.Seats.HasValue) entity.Seats = dto.Seats.Value;

        await _tableRepository.UpdateAsync(entity);
        return MapToDto(entity);
    }

    public async Task DeleteTableAsync(Guid tableId)
    {
        await _tableRepository.DeleteAsync(tableId);
    }

    public async Task AssignGuestToTableAsync(AssignGuestToTableDto dto)
    {
        if (dto.TableId.HasValue && dto.TableId.Value != Guid.Empty)
        {
            var table = await _tableRepository.GetByIdAsync(dto.TableId.Value)
                ?? throw new KeyNotFoundException($"Table with id {dto.TableId} not found.");

            var currentGuests = table.Guests.ToList();

            int newTotalSlots = 0;
            var guestsToUpdate = new List<Guest>();

            foreach (var guestId in dto.GuestIds)
            {
                var guest = await _guestRepository.GetByIdAsync(guestId)
                    ?? throw new KeyNotFoundException($"Guest with id {guestId} not found.");
                guestsToUpdate.Add(guest);
                newTotalSlots += (1 + guest.AdditionalGuests + guest.Children);
            }

            if (newTotalSlots > table.Seats)
            {
                throw new InvalidOperationException($"Table '{table.Name}' does not have enough seats.");
            }

            var guestIdsSet = new HashSet<Guid>(dto.GuestIds);
            foreach (var g in currentGuests)
            {
                if (!guestIdsSet.Contains(g.Id))
                {
                    g.TableId = null;
                    await _guestRepository.UpdateAsync(g);
                }
            }

            foreach(var g in guestsToUpdate)
            {
                if (g.TableId != table.Id)
                {
                    g.TableId = table.Id;
                    await _guestRepository.UpdateAsync(g);
                }
            }
        }
        else
        {
            foreach (var guestId in dto.GuestIds)
            {
                var guest = await _guestRepository.GetByIdAsync(guestId);
                if (guest != null && guest.TableId.HasValue)
                {
                    guest.TableId = null;
                    await _guestRepository.UpdateAsync(guest);
                }
            }
        }
    }

    public async Task AutoAssignSeatsAsync(Guid eventId)
    {
        var tables = await _tableRepository.GetByEventIdAsync(eventId);
        var unassigned = await _guestRepository.GetUnassignedByEventIdAsync(eventId);
        var attendingGuests = unassigned
            .Where(g => g.RsvpStatus == "attending")
            .ToList();

        var groupedByCategory = attendingGuests
            .GroupBy(g => g.Category ?? "other")
            .OrderByDescending(g => g.Count())
            .ToList();

        var tableCapacities = tables
            .Select(t => new
            {
                Table = t,
                AvailableSeats = t.Seats - t.Guests.Sum(g => 1 + g.AdditionalGuests)
            })
            .Where(t => t.AvailableSeats > 0)
            .OrderByDescending(t => t.AvailableSeats)
            .ToList();

        foreach (var group in groupedByCategory)
        {
            foreach (var guest in group)
            {
                var slotsNeeded = 1 + guest.AdditionalGuests;
                var suitableTable = tableCapacities.FirstOrDefault(t => t.AvailableSeats >= slotsNeeded);
                if (suitableTable != null)
                {
                    guest.TableId = suitableTable.Table.Id;
                    await _guestRepository.UpdateAsync(guest);

                    tableCapacities = tableCapacities
                        .Select(t => t.Table.Id == suitableTable.Table.Id
                            ? new { t.Table, AvailableSeats = t.AvailableSeats - slotsNeeded }
                            : t)
                        .Where(t => t.AvailableSeats > 0)
                        .OrderByDescending(t => t.AvailableSeats)
                        .ToList();
                }
            }
        }
    }

    private static TableResponseDto MapToDto(Table entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Seats = entity.Seats,
        OccupiedSeats = entity.Guests.Sum(g => 1 + g.AdditionalGuests),
        Guests = entity.Guests.Select(g => new GuestResponseDto
        {
            Id = g.Id,
            EventId = g.EventId,
            Name = g.Name,
            RsvpStatus = g.RsvpStatus,
            AdditionalGuests = g.AdditionalGuests,
            Children = g.Children,
            Category = g.Category,
            TableId = g.TableId,
            TableName = entity.Name
        }).ToList()
    };
}
