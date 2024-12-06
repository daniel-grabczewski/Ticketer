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
        [Authorize]
        public async Task<IActionResult> GetTicketById(string ticketId)
        {
            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

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
        [AllowAnonymous]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("User is not authenticated or guest ID is missing.");
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var list = await _context.Lists
                .Include(l => l.Board)
                .FirstOrDefaultAsync(l => l.Id == request.ListId && l.Board.UserId == userId);

            if (list == null)
            {
                return BadRequest("Invalid list ID or you do not have access to this list.");
            }

            int nextPosition = await _context.Tickets
                .Where(t => t.ListId == request.ListId)
                .MaxAsync(t => (int?)t.Position) ?? 0;
            nextPosition += 1;

            var newTicket = new Ticket
            {
                Id = request.Id,
                Name = request.Name,
                ListId = request.ListId,
                Position = nextPosition,
                ColorId = null,
                Description = "",
            };

            await _context.Tickets.AddAsync(newTicket);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Ticket created successfully!" });
        }

        // PUT: api/tickets
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateTicket([FromBody] UpdateTicketRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == request.Id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

            ticket.Name = request.Name;
            ticket.Description = request.Description;

            if (request.ColorId.HasValue)
            {
                var colorExists = await _context.Colors.AnyAsync(c => c.Id == request.ColorId.Value);
                if (!colorExists)
                {
                    return BadRequest("The provided ColorId does not exist.");
                }
                ticket.ColorId = request.ColorId;
            }
            else
            {
                ticket.ColorId = null;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Ticket updated successfully!" });
        }

        // PUT: api/tickets/changePosition
        [HttpPut("changePosition")]
        [Authorize]
        public async Task<IActionResult> UpdateTicketPosition([FromBody] UpdateTicketPositionRequestDTO request)
        {
            if (string.IsNullOrEmpty(request.Id) || string.IsNullOrEmpty(request.ListId))
            {
                return BadRequest("Ticket ID and List ID are required.");
            }

            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == request.Id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

            string originalListId = ticket.ListId;
            int originalPosition = ticket.Position;

            if (ticket.ListId != request.ListId)
            {
                // Moving ticket to a different list
                var ticketsInOldList = await _context.Tickets
                    .Where(t => t.ListId == originalListId && t.Position > originalPosition)
                    .ToListAsync();

                foreach (var t in ticketsInOldList)
                {
                    t.Position -= 1;
                }

                ticket.ListId = request.ListId;
                int newPosition = request.NewPosition ?? 1;

                var ticketsInNewList = await _context.Tickets
                    .Where(t => t.ListId == request.ListId && t.Position >= newPosition)
                    .ToListAsync();

                foreach (var t in ticketsInNewList)
                {
                    t.Position += 1;
                }

                ticket.Position = newPosition;
            }
            else
            {
                // Moving within the same list
                int newPosition = request.NewPosition ?? 1;

                if (newPosition == originalPosition)
                {
                    return Ok(new { Message = "Ticket position unchanged." });
                }

                if (newPosition < originalPosition)
                {
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
                    var ticketsToShift = await _context.Tickets
                        .Where(t => t.ListId == ticket.ListId && t.Position > originalPosition && t.Position <= newPosition)
                        .ToListAsync();

                    foreach (var t in ticketsToShift)
                    {
                        t.Position -= 1;
                    }
                }

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
            var ticket = await _context.Tickets
                .Include(t => t.List)
                .ThenInclude(l => l.Board)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            if (ticket.List.Board.UserId != userId)
            {
                return Forbid("You do not have access to this ticket.");
            }

            int ticketPosition = ticket.Position;
            string listId = ticket.ListId;

            _context.Tickets.Remove(ticket);

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
    }
}
