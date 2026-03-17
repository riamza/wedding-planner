using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingPlanner.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameAllTablesToSnakeCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_users_UserId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_Gifts_Events_EventId",
                table: "Gifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Guests_Events_EventId",
                table: "Guests");

            migrationBuilder.DropForeignKey(
                name: "FK_Guests_Tables_TableId",
                table: "Guests");

            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Events_EventId",
                table: "Photos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tables_Events_EventId",
                table: "Tables");

            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_Events_EventId",
                table: "Vendors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vendors",
                table: "Vendors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tables",
                table: "Tables");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Photos",
                table: "Photos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Guests",
                table: "Guests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Gifts",
                table: "Gifts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Events",
                table: "Events");

            migrationBuilder.RenameTable(
                name: "Vendors",
                newName: "vendors");

            migrationBuilder.RenameTable(
                name: "Tables",
                newName: "tables");

            migrationBuilder.RenameTable(
                name: "Photos",
                newName: "photos");

            migrationBuilder.RenameTable(
                name: "Guests",
                newName: "guests");

            migrationBuilder.RenameTable(
                name: "Gifts",
                newName: "gifts");

            migrationBuilder.RenameTable(
                name: "Events",
                newName: "events");

            migrationBuilder.RenameIndex(
                name: "IX_Vendors_EventId",
                table: "vendors",
                newName: "IX_vendors_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_Tables_EventId",
                table: "tables",
                newName: "IX_tables_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_Photos_EventId",
                table: "photos",
                newName: "IX_photos_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_Guests_TableId",
                table: "guests",
                newName: "IX_guests_TableId");

            migrationBuilder.RenameIndex(
                name: "IX_Guests_InvitationToken",
                table: "guests",
                newName: "IX_guests_InvitationToken");

            migrationBuilder.RenameIndex(
                name: "IX_Guests_EventId",
                table: "guests",
                newName: "IX_guests_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_Gifts_EventId",
                table: "gifts",
                newName: "IX_gifts_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_Events_UserId",
                table: "events",
                newName: "IX_events_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Events_Slug",
                table: "events",
                newName: "IX_events_Slug");

            migrationBuilder.AddPrimaryKey(
                name: "PK_vendors",
                table: "vendors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tables",
                table: "tables",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_photos",
                table: "photos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_guests",
                table: "guests",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_gifts",
                table: "gifts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_events",
                table: "events",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_events_users_UserId",
                table: "events",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_gifts_events_EventId",
                table: "gifts",
                column: "EventId",
                principalTable: "events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_guests_events_EventId",
                table: "guests",
                column: "EventId",
                principalTable: "events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_guests_tables_TableId",
                table: "guests",
                column: "TableId",
                principalTable: "tables",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_photos_events_EventId",
                table: "photos",
                column: "EventId",
                principalTable: "events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tables_events_EventId",
                table: "tables",
                column: "EventId",
                principalTable: "events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_vendors_events_EventId",
                table: "vendors",
                column: "EventId",
                principalTable: "events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_events_users_UserId",
                table: "events");

            migrationBuilder.DropForeignKey(
                name: "FK_gifts_events_EventId",
                table: "gifts");

            migrationBuilder.DropForeignKey(
                name: "FK_guests_events_EventId",
                table: "guests");

            migrationBuilder.DropForeignKey(
                name: "FK_guests_tables_TableId",
                table: "guests");

            migrationBuilder.DropForeignKey(
                name: "FK_photos_events_EventId",
                table: "photos");

            migrationBuilder.DropForeignKey(
                name: "FK_tables_events_EventId",
                table: "tables");

            migrationBuilder.DropForeignKey(
                name: "FK_vendors_events_EventId",
                table: "vendors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_vendors",
                table: "vendors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tables",
                table: "tables");

            migrationBuilder.DropPrimaryKey(
                name: "PK_photos",
                table: "photos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_guests",
                table: "guests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_gifts",
                table: "gifts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_events",
                table: "events");

            migrationBuilder.RenameTable(
                name: "vendors",
                newName: "Vendors");

            migrationBuilder.RenameTable(
                name: "tables",
                newName: "Tables");

            migrationBuilder.RenameTable(
                name: "photos",
                newName: "Photos");

            migrationBuilder.RenameTable(
                name: "guests",
                newName: "Guests");

            migrationBuilder.RenameTable(
                name: "gifts",
                newName: "Gifts");

            migrationBuilder.RenameTable(
                name: "events",
                newName: "Events");

            migrationBuilder.RenameIndex(
                name: "IX_vendors_EventId",
                table: "Vendors",
                newName: "IX_Vendors_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_tables_EventId",
                table: "Tables",
                newName: "IX_Tables_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_photos_EventId",
                table: "Photos",
                newName: "IX_Photos_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_guests_TableId",
                table: "Guests",
                newName: "IX_Guests_TableId");

            migrationBuilder.RenameIndex(
                name: "IX_guests_InvitationToken",
                table: "Guests",
                newName: "IX_Guests_InvitationToken");

            migrationBuilder.RenameIndex(
                name: "IX_guests_EventId",
                table: "Guests",
                newName: "IX_Guests_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_gifts_EventId",
                table: "Gifts",
                newName: "IX_Gifts_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_events_UserId",
                table: "Events",
                newName: "IX_Events_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_events_Slug",
                table: "Events",
                newName: "IX_Events_Slug");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vendors",
                table: "Vendors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tables",
                table: "Tables",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Photos",
                table: "Photos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Guests",
                table: "Guests",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Gifts",
                table: "Gifts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Events",
                table: "Events",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_users_UserId",
                table: "Events",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Gifts_Events_EventId",
                table: "Gifts",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Guests_Events_EventId",
                table: "Guests",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Guests_Tables_TableId",
                table: "Guests",
                column: "TableId",
                principalTable: "Tables",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Events_EventId",
                table: "Photos",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tables_Events_EventId",
                table: "Tables",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_Events_EventId",
                table: "Vendors",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
