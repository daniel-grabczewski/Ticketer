using Microsoft.AspNetCore.Mvc;
using backend.Models; // Assuming you have a Ticket model class
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]  // Ensure the authentication middleware runs
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/tickets
        [HttpPost]
        [AllowAnonymous] // Allow anonymous access for guest users
        public async Task<IActionResult> CreateTicketAsync([FromBody] Ticket newTicket)
        {
            // Check if the user is authenticated
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(auth0UserId))
            {
                // Authenticated user
                newTicket.UserId = auth0UserId;
                newTicket.IsGuest = false;
            }
            else
            {
                // Check if the user is a guest by checking the GuestId cookie
                string guestId = Request.Cookies["GuestId"];

                if (!string.IsNullOrEmpty(guestId))
                {
                    // Guest user
                    newTicket.UserId = guestId;
                    newTicket.IsGuest = true;
                }
                else
                {
                    return Unauthorized();
                }
            }

            // Set creation and update times
            newTicket.CreatedAt = DateTime.UtcNow;
            newTicket.UpdatedAt = DateTime.UtcNow;

            // Add the new ticket to the context
            await _context.Tickets.AddAsync(newTicket);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Ticket saved successfully!", Ticket = newTicket });
        }

        // GET: api/tickets
        [HttpGet]
        [AllowAnonymous] // Allow anonymous access for guest users
        public async Task<IActionResult> GetAllTicketsAsync()
        {
            // Check if the user is authenticated
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(auth0UserId))
            {
                // Authenticated user
                var tickets = await _context.Tickets
                    .Where(t => !t.IsGuest && t.UserId == auth0UserId)
                    .ToListAsync();

                return Ok(tickets);
            }
            else
            {
                // Check if the user is a guest by checking the GuestId cookie
                string guestId = Request.Cookies["GuestId"];

                if (!string.IsNullOrEmpty(guestId))
                {
                    // Guest user
                    var tickets = await _context.Tickets
                        .Where(t => t.IsGuest && t.UserId == guestId)
                        .ToListAsync();

                    return Ok(tickets);
                }
                else
                {
                    return Unauthorized();
                }
            }
        }

        // PUT: api/tickets/{id}
        [HttpPut("{id}")]
        [AllowAnonymous] // Allow anonymous access for guest users
        public async Task<IActionResult> UpdateTicketByIdAsync(
            int id, [FromBody] UpdateTicketDto updatedTicket)
        {
            // Check if the user is authenticated
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Ticket ticket = null;

            if (!string.IsNullOrEmpty(auth0UserId))
            {
                // Authenticated user
                ticket = await _context.Tickets
                    .SingleOrDefaultAsync(t => t.Id == id && !t.IsGuest && t.UserId == auth0UserId);
            }
            else
            {
                // Check if the user is a guest by checking the GuestId cookie
                string guestId = Request.Cookies["GuestId"];

                if (!string.IsNullOrEmpty(guestId))
                {
                    // Guest user
                    ticket = await _context.Tickets
                        .SingleOrDefaultAsync(t => t.Id == id && t.IsGuest && t.UserId == guestId);
                }
                else
                {
                    return Unauthorized();
                }
            }

            if (ticket == null)
            {
                return NotFound();
            }

            // Update the ticket fields
            ticket.Title = updatedTicket.Title;
            ticket.Description = updatedTicket.Description;
            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(ticket);
        }

        // DELETE: api/tickets/{id}
        [HttpDelete("{id}")]
        [AllowAnonymous] // Allow anonymous access for guest users
        public async Task<IActionResult> DeleteTicketByIdAsync(int id)
        {
            // Check if the user is authenticated
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Ticket ticket = null;

            if (!string.IsNullOrEmpty(auth0UserId))
            {
                // Authenticated user
                ticket = await _context.Tickets
                    .SingleOrDefaultAsync(t => t.Id == id && !t.IsGuest && t.UserId == auth0UserId);
            }
            else
            {
                // Check if the user is a guest by checking the GuestId cookie
                string guestId = Request.Cookies["GuestId"];

                if (!string.IsNullOrEmpty(guestId))
                {
                    // Guest user
                    ticket = await _context.Tickets
                        .SingleOrDefaultAsync(t => t.Id == id && t.IsGuest && t.UserId == guestId);
                }
                else
                {
                    return Unauthorized();
                }
            }

            if (ticket == null)
            {
                return NotFound();
            }

            // Remove the ticket from the context
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
