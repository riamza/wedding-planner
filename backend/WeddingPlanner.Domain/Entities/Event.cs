namespace WeddingPlanner.Domain.Entities;

public class Event
{
    public Guid Id { get; set; } = Guid.NewGuid();
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
    public string InvitationMode { get; set; } = "simple";
    public string SelectedPackage { get; set; } = "Free"; 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string CustomGroups { get; set; } = "Familie,Prieteni"; // Stored as comma-separated string

    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }

    // Navigation properties
    public ICollection<Guest> Guests { get; set; } = new List<Guest>();
    public ICollection<Table> Tables { get; set; } = new List<Table>();
    public ICollection<Vendor> Vendors { get; set; } = new List<Vendor>();      
    public ICollection<Gift> Gifts { get; set; } = new List<Gift>();
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
}
