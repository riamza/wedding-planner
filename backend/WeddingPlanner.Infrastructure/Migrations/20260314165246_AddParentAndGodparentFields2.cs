using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingPlanner.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddParentAndGodparentFields2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BrideFatherName",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BrideMotherName",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GodfatherName",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GodmotherName",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroomFatherName",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroomMotherName",
                table: "events",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrideFatherName",
                table: "events");

            migrationBuilder.DropColumn(
                name: "BrideMotherName",
                table: "events");

            migrationBuilder.DropColumn(
                name: "GodfatherName",
                table: "events");

            migrationBuilder.DropColumn(
                name: "GodmotherName",
                table: "events");

            migrationBuilder.DropColumn(
                name: "GroomFatherName",
                table: "events");

            migrationBuilder.DropColumn(
                name: "GroomMotherName",
                table: "events");
        }
    }
}
