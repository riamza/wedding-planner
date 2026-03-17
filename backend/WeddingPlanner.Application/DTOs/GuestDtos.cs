namespace WeddingPlanner.Application.DTOs;

public class CreateGuestDto
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
}

public class UpdateGuestDto
{
    public string? Name { get; set; }
    public string? RsvpStatus { get; set; }
    public int? AdditionalGuests { get; set; }
    public int? Children { get; set; }
    public string? Category { get; set; }
    public string? Message { get; set; }
    public string? Notes { get; set; }
    public Guid? TableId { get; set; }
}

public class RsvpSubmitDto
{
    public string Name { get; set; } = string.Empty;
    public string RsvpStatus { get; set; } = "attending";
    public int AdditionalGuests { get; set; } = 0;
    public int Children { get; set; } = 0;
    public string? Message { get; set; }
    public string? Notes { get; set; }
}

public class GuestResponseDto
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RsvpStatus { get; set; } = string.Empty;
    public int AdditionalGuests { get; set; }
    public int Children { get; set; }
    public string? Category { get; set; }
    public string? Message { get; set; }
    public string? Notes { get; set; }
    public string? InvitationToken { get; set; }
    public Guid? TableId { get; set; }
    public string? TableName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GuestStatsDto
{
    public int TotalInvited { get; set; }
    public int Confirmed { get; set; }
    public int Declined { get; set; }
    public int Pending { get; set; }
    public int TotalAttending { get; set; }
    public int TotalChildren { get; set; }
}

public class TableLookupDto
{
    public string GuestName { get; set; } = string.Empty;
    public string? TableName { get; set; }
    public bool Found { get; set; }
}
