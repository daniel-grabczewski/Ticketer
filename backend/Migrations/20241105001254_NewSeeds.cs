using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class NewSeeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Colors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    HexCode = table.Column<string>(type: "varchar(7)", maxLength: 7, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colors", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsGuest = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Boards",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ColorId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Boards_Colors_ColorId",
                        column: x => x.ColorId,
                        principalTable: "Colors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Boards_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Lists",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BoardId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Position = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lists_Boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "Boards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ListId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ColorId = table.Column<int>(type: "int", nullable: true),
                    Position = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tickets_Colors_ColorId",
                        column: x => x.ColorId,
                        principalTable: "Colors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tickets_Lists_ListId",
                        column: x => x.ListId,
                        principalTable: "Lists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Colors",
                columns: new[] { "Id", "HexCode" },
                values: new object[,]
                {
                    { 1, "#50C996" },
                    { 2, "#3BBA3B" },
                    { 3, "#8131F9" },
                    { 4, "#FEA362" },
                    { 5, "#F773BE" },
                    { 6, "#EE4646" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "IsGuest", "UserName" },
                values: new object[] { "google-oauth2|116927637409288985519", false, "User" });

            migrationBuilder.InsertData(
                table: "Boards",
                columns: new[] { "Id", "ColorId", "CreatedAt", "Name", "UpdatedAt", "UserId" },
                values: new object[] { "test-id-123", 1, new DateTime(2024, 11, 5, 0, 12, 54, 327, DateTimeKind.Utc).AddTicks(4165), "test marketing board", new DateTime(2024, 11, 5, 0, 12, 54, 327, DateTimeKind.Utc).AddTicks(4167), "google-oauth2|116927637409288985519" });

            migrationBuilder.InsertData(
                table: "Lists",
                columns: new[] { "Id", "BoardId", "Name", "Position" },
                values: new object[,]
                {
                    { "list-1", "test-id-123", "To Do", 1 },
                    { "list-2", "test-id-123", "In Progress", 2 },
                    { "list-3", "test-id-123", "Review", 3 },
                    { "list-4", "test-id-123", "Completed", 4 }
                });

            migrationBuilder.InsertData(
                table: "Tickets",
                columns: new[] { "Id", "ColorId", "Description", "ListId", "Name", "Position" },
                values: new object[,]
                {
                    { "ticket-1", 2, "Outline key strategies.", "list-1", "Create Marketing Plan", 1 },
                    { "ticket-10", 4, "Send out to subscribers.", "list-4", "Launch Survey", 3 },
                    { "ticket-2", 3, "Gather competitive insights.", "list-1", "Research Competitors", 2 },
                    { "ticket-3", 4, "Draft posts for Q1.", "list-2", "Social Media Campaign", 1 },
                    { "ticket-4", 5, "Initial design concept.", "list-2", "Design Landing Page", 2 },
                    { "ticket-5", 6, "SEO-focused articles.", "list-2", "Write Blog Posts", 3 },
                    { "ticket-6", 2, "Get approval from finance.", "list-3", "Budget Approval", 1 },
                    { "ticket-7", 4, "Prepare Q1 newsletter.", "list-3", "Draft Newsletter", 2 },
                    { "ticket-8", 1, "Google Analytics setup.", "list-4", "Set Up Analytics", 1 },
                    { "ticket-9", 2, "Discuss goals and milestones.", "list-4", "Team Meeting", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Boards_ColorId",
                table: "Boards",
                column: "ColorId");

            migrationBuilder.CreateIndex(
                name: "IX_Boards_UserId",
                table: "Boards",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Lists_BoardId",
                table: "Lists",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ColorId",
                table: "Tickets",
                column: "ColorId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ListId",
                table: "Tickets",
                column: "ListId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Lists");

            migrationBuilder.DropTable(
                name: "Boards");

            migrationBuilder.DropTable(
                name: "Colors");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
