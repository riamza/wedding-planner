using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WeddingPlanner.Domain.Entities;

namespace WeddingPlanner.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<Guest> Guests => Set<Guest>();
    public DbSet<Table> Tables => Set<Table>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<Gift> Gifts => Set<Gift>();
    public DbSet<Photo> Photos => Set<Photo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Rename Identity tables
        modelBuilder.Entity<ApplicationUser>(entity => { entity.ToTable("users"); });
        modelBuilder.Entity<IdentityRole>(entity => { entity.ToTable("roles"); });
        modelBuilder.Entity<IdentityUserRole<string>>(entity => { entity.ToTable("user_roles"); });
        modelBuilder.Entity<IdentityUserClaim<string>>(entity => { entity.ToTable("user_claims"); });
        modelBuilder.Entity<IdentityUserLogin<string>>(entity => { entity.ToTable("user_logins"); });
        modelBuilder.Entity<IdentityRoleClaim<string>>(entity => { entity.ToTable("role_claims"); });
        modelBuilder.Entity<IdentityUserToken<string>>(entity => { entity.ToTable("user_tokens"); });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.ToTable("events");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.BrideName).HasMaxLength(200);
            entity.Property(e => e.GroomName).HasMaxLength(200);
            entity.Property(e => e.Slug).HasMaxLength(200);
            entity.Property(e => e.InvitationMode).HasMaxLength(20);

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Events)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Guest>(entity =>
        {
            entity.ToTable("guests");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.InvitationToken).IsUnique().HasFilter("\"InvitationToken\" IS NOT NULL");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.RsvpStatus).HasMaxLength(20);
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.HasOne(e => e.Event).WithMany(ev => ev.Guests).HasForeignKey(e => e.EventId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Table).WithMany(t => t.Guests).HasForeignKey(e => e.TableId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Table>(entity =>
        {
            entity.ToTable("tables");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.HasOne(e => e.Event).WithMany(ev => ev.Tables).HasForeignKey(e => e.EventId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Vendor>(entity =>
        {
            entity.ToTable("vendors");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.AdvancePaid).HasColumnType("decimal(18,2)");
            entity.Property(e => e.RemainingBalance).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Event).WithMany(ev => ev.Vendors).HasForeignKey(e => e.EventId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Gift>(entity =>
        {
            entity.ToTable("gifts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.GuestName).HasMaxLength(200);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Event).WithMany(ev => ev.Gifts).HasForeignKey(e => e.EventId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Photo>(entity =>
        {
            entity.ToTable("photos");
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Event).WithMany(ev => ev.Photos).HasForeignKey(e => e.EventId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
