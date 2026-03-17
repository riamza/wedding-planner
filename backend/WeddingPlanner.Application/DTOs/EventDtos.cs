namespace WeddingPlanner.Application.DTOs;

public class CreateEventDto
{
    public string BrideName { get; set; } = string.Empty;
    public string? BrideMotherName { get; set; }
    public string? BrideFatherName { get; set; }
    public string GroomName { get; set; } = string.Empty;
    public string? GroomMotherName { get; set; }
    public string? GroomFatherName { get; set; }
    public string? GodmotherName { get; set; }
    public string? GodfatherName { get; set; }
    public DateTime EventDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Schedule { get; set; }
    public string? InvitationMessage { get; set; }
    public string? TemplateName { get; set; }
    public string InvitationMode { get; set; } = "simple";
    public string SelectedPackage { get; set; } = "Free";
}

public class UpdateEventDto
{
    public string? BrideName { get; set; }
    public string? BrideMotherName { get; set; }
    public string? BrideFatherName { get; set; }
    public string? GroomName { get; set; }
    public string? GroomMotherName { get; set; }
    public string? GroomFatherName { get; set; }
    public string? GodmotherName { get; set; }
    public string? GodfatherName { get; set; }
    public DateTime? EventDate { get; set; }
    public string? Location { get; set; }
    public string? Schedule { get; set; }
    public string? InvitationMessage { get; set; }
    public string? TemplateName { get; set; }
    public string? InvitationMode { get; set; }
    public string? SelectedPackage { get; set; }
    public string? CustomGroups { get; set; }
}

public class EventResponseDto
{
    public Guid Id { get; set; }
    public string BrideName { get; set; } = string.Empty;
    public string? BrideMotherName { get; set; }
    public string? BrideFatherName { get; set; }
    public string GroomName { get; set; } = string.Empty;
    public string? GroomMotherName { get; set; }
    public string? GroomFatherName { get; set; }
    public string? GodmotherName { get; set; }
    public string? GodfatherName { get; set; }
    public DateTime EventDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Schedule { get; set; }
    public string? InvitationMessage { get; set; }
    public string? TemplateName { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string InvitationMode { get; set; } = string.Empty;
    public string SelectedPackage { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string CustomGroups { get; set; } 
}
