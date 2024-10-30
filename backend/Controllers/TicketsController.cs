using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using YourProject.Models;
using DTOs.Ticket;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/tickets/{ticketId}
        [HttpGet("{ticketId}")]
        [Authorize] // Ensure only authenticated users can access this
        public async Task<IActionResult> GetTicketById(string ticketId)
        {
            // Retrieve the ticket
            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            // Check if the user has access to this ticket
            string userId = await GetUserIdAsync();
            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

            // Prepare the response
            var response = new GetTicketDetailsResponseDTO
            {
                Id = ticket.Id,
                Name = ticket.Name,
                Description = ticket.Description,
                Position = ticket.Position,
                ColorId = ticket.ColorId,
                ListId = ticket.ListId,
                ListName = ticket.List.Name,
                BoardId = ticket.List.BoardId
            };

            return Ok(response);
        }

        // POST: api/tickets
        [HttpPost]
        [AllowAnonymous] // Allow anonymous access for guest users
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketRequestDTO request)
        {
            // Validate the request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Determine the user ID
            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated or guest ID is missing.");
            }

            // Check if the list exists and belongs to the user
            var list = await _context.Lists
                .Include(l => l.Board)
                .FirstOrDefaultAsync(l => l.Id == request.ListId && l.Board.UserId == userId);

            if (list == null)
            {
                return BadRequest("Invalid list ID or you do not have access to this list.");
            }

            // Determine the next position (end of the list)
            int nextPosition = await _context.Tickets
                .Where(t => t.ListId == request.ListId)
                .MaxAsync(t => (int?)t.Position) ?? 0;
            nextPosition += 1;

            // Create the new ticket
            var newTicket = new Ticket
            {
                Id = request.Id,
                Name = request.Name,
                ListId = request.ListId,
                Position = nextPosition,
                ColorId = null, // Default color ID if needed
                Description = "", // Default description
            };

            // Add the ticket to the context
            await _context.Tickets.AddAsync(newTicket);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Ticket created successfully!" });
        }

        // PUT: api/tickets
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateTicket([FromBody] UpdateTicketRequestDTO request)
        {
            // Validate the request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieve the ticket
            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == request.Id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            // Check if the user has access to this ticket
            string userId = await GetUserIdAsync();
            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

            // Update the ticket
            ticket.Name = request.Name;
            ticket.Description = request.Description;
            ticket.ColorId = request.ColorId;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Ticket updated successfully!" });
        }

        // PUT: api/tickets/changePosition
        [HttpPut("changePosition")]
        [Authorize]
        public async Task<IActionResult> UpdateTicketPosition([FromBody] UpdateTicketPositionRequestDTO request)
        {
            // Validate the request
            if (string.IsNullOrEmpty(request.Id) || string.IsNullOrEmpty(request.ListId))
            {
                return BadRequest("Ticket ID and List ID are required.");
            }

            // Retrieve the ticket
            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == request.Id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            // Check if the user has access to this ticket
            string userId = await GetUserIdAsync();
            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

            // Store original list and position
            string originalListId = ticket.ListId;
            int originalPosition = ticket.Position;

            // If the list has changed, adjust positions in both lists
            if (ticket.ListId != request.ListId)
            {
                // Remove ticket from old list and adjust positions
                var ticketsInOldList = await _context.Tickets
                    .Where(t => t.ListId == originalListId && t.Position > originalPosition)
                    .ToListAsync();

                foreach (var t in ticketsInOldList)
                {
                    t.Position -= 1;
                }

                // Set the ticket's new list
                ticket.ListId = request.ListId;

                // Determine new position
                int newPosition = request.NewPosition ?? 1;

                // Get tickets in the new list at or after the new position
                var ticketsInNewList = await _context.Tickets
                    .Where(t => t.ListId == request.ListId && t.Position >= newPosition)
                    .ToListAsync();

                // Increment positions of tickets in the new list
                foreach (var t in ticketsInNewList)
                {
                    t.Position += 1;
                }

                // Set the ticket's new position
                ticket.Position = newPosition;
            }
            else
            {
                // Moving within the same list
                int newPosition = request.NewPosition ?? 1;

                if (newPosition == originalPosition)
                {
                    // No change in position
                    return Ok(new { Message = "Ticket position unchanged." });
                }

                if (newPosition < originalPosition)
                {
                    // Moving up
                    var ticketsToShift = await _context.Tickets
                        .Where(t => t.ListId == ticket.ListId && t.Position >= newPosition && t.Position < originalPosition)
                        .ToListAsync();

                    foreach (var t in ticketsToShift)
                    {
                        t.Position += 1;
                    }
                }
                else
                {
                    // Moving down
                    var ticketsToShift = await _context.Tickets
                        .Where(t => t.ListId == ticket.ListId && t.Position > originalPosition && t.Position <= newPosition)
                        .ToListAsync();

                    foreach (var t in ticketsToShift)
                    {
                        t.Position -= 1;
                    }
                }

                // Update the ticket's position
                ticket.Position = newPosition;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Ticket position updated successfully." });
        }

        // DELETE: api/tickets/{ticketId}
        [HttpDelete("{ticketId}")]
        [Authorize]
        public async Task<IActionResult> DeleteTicket(string ticketId)
        {
            // Retrieve the ticket
            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            // Check if the user has access to this ticket
            string userId = await GetUserIdAsync();
            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

            // Store the position and list ID before deleting
            int ticketPosition = ticket.Position;
            string listId = ticket.ListId;

            // Remove the ticket
            _context.Tickets.Remove(ticket);

            // Adjust positions of other tickets in the same list
            var ticketsToAdjust = await _context.Tickets
                .Where(t => t.ListId == listId && t.Position > ticketPosition)
                .ToListAsync();

            foreach (var t in ticketsToAdjust)
            {
                t.Position -= 1;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Ticket deleted successfully." });
        }

        // Helper method to get the user ID (Authenticated user ID or Guest ID)
        private async Task<string> GetUserIdAsync()
        {
            // Check if the user is authenticated
            if (User.Identity.IsAuthenticated)
            {
                return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
            else
            {
                // Check if the user is a guest by checking the GuestId cookie
                string guestId = Request.Cookies["GuestId"];

                if (!string.IsNullOrEmpty(guestId))
                {
                    // Verify that the guest user exists
                    var guestUserExists = await _context.Users.AnyAsync(u => u.Id == guestId && u.IsGuest);

                    if (guestUserExists)
                    {
                        return guestId;
                    }
                }
            }

            return null; // User is neither authenticated nor a valid guest
        }
    }
}
