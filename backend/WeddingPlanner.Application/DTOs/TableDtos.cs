namespace WeddingPlanner.Application.DTOs;

public class CreateTableDto
{
    public string Name { get; set; } = string.Empty;
    public int Seats { get; set; }
}

public class UpdateTableDto
{
    public string? Name { get; set; }
    public int? Seats { get; set; }
}

public class AssignGuestToTableDto
{
    public List<Guid> GuestIds { get; set; } = new();
    public Guid? TableId { get; set; }
}

public class TableResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Seats { get; set; }
    public int OccupiedSeats { get; set; }
    public List<GuestResponseDto> Guests { get; set; } = new();
}
