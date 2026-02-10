using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingShowTimeRelationFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShowTimes_Movies_MovieId",
                table: "ShowTimes");

            migrationBuilder.DropColumn(
                name: "ShowTime",
                table: "Bookings");

            migrationBuilder.AddColumn<int>(
                name: "ShowTimeId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ShowTimeId",
                table: "Bookings",
                column: "ShowTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_ShowTimes_ShowTimeId",
                table: "Bookings",
                column: "ShowTimeId",
                principalTable: "ShowTimes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ShowTimes_Movies_MovieId",
                table: "ShowTimes",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_ShowTimes_ShowTimeId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_ShowTimes_Movies_MovieId",
                table: "ShowTimes");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_ShowTimeId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "ShowTimeId",
                table: "Bookings");

            migrationBuilder.AddColumn<string>(
                name: "ShowTime",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_ShowTimes_Movies_MovieId",
                table: "ShowTimes",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
