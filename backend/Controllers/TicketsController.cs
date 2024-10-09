using Microsoft.AspNetCore.Mvc;
using backend.Models; // Assuming you have a Ticket model class created in Models folder
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims; // Required for Auth0 claims extraction

[ApiController]
[Route("api/[controller]")]  // Route: /api/tickets

// Use 'dotnet watch run' in terminal if you server to update whenever you make changes. Otherwise, you'll need to keep restarting.

public class TicketsController : ControllerBase
{

    private readonly ApplicationDbContext _context;
    public TicketsController(ApplicationDbContext context)
    {
        _context = context; 
    }

    // POST: api/tickets
    [HttpPost]

    public async Task<IActionResult> CreateTicketAsync([FromBody] Ticket newTicket)
    {
        // Check if the user is a guest by seeing if there's a GuestId cookie
        string guestId = Request.Cookies["GuestId"];

        if (!string.IsNullOrEmpty(guestId))
        {
            // Guest user, assign the GuestId to the UserId field
            newTicket.UserId = guestId;
            newTicket.IsGuest = true;
        }
        else
        {
            // Auth0 user, extract the Auth0 ID from the claims (assuming you have Auth0 authentication set up)
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // "sub" in Auth0 is usually mapped to NameIdentifier

            if (auth0UserId == null)
            {
                return Unauthorized("User must be authenticated");
            }

            newTicket.UserId = auth0UserId;
            newTicket.IsGuest = false;
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

[HttpGet]
public async Task<IActionResult> GetAllTicketsAsync()
{
    // Step 1: Check user authentication (guest or Auth0)
    string guestId = Request.Cookies["GuestId"];
    string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(guestId) && auth0UserId == null)
    {
        return Unauthorized("User must be authenticated");
    }

    // Step 2: Retrieve tickets for the current user (guest or Auth0)
    var tickets = await _context.Tickets
        .Where(t => (t.IsGuest && t.UserId == guestId) || (!t.IsGuest && t.UserId == auth0UserId))
        .ToListAsync();

    // Step 3: Return the list of tickets
    return Ok(tickets);
}


[HttpPut("{id}")]
[HttpPut("{id}")]
public async Task<IActionResult> UpdateTicketByIdAsync(int id, [FromBody] UpdateTicketDto updatedTicket)
{
    // Step 1: Check user authentication (guest or Auth0)
    string guestId = Request.Cookies["GuestId"];
    string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(guestId) && auth0UserId == null)
    {
        return Unauthorized("User must be authenticated");
    }

    // Step 2: Retrieve the ticket from the database
    var ticket = await _context.Tickets.FindAsync(id);

    if (ticket == null)
    {
        return NotFound();
    }

    // Step 3: Ensure the user is authorized to update the ticket
    if ((ticket.IsGuest && ticket.UserId != guestId) || (!ticket.IsGuest && ticket.UserId != auth0UserId))
    {
        return Unauthorized("You do not have permission to update this ticket.");
    }

    // Step 4: Update the ticket fields
    ticket.Title = updatedTicket.Title;
    ticket.Description = updatedTicket.Description;
    ticket.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return Ok(ticket);
}

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteTicketByIdAsync(int id) {
  var ticket = await _context.Tickets.FindAsync(id);
  Console.WriteLine(ticket);
  if (ticket == null) {
    return  NotFound();
  }

  _context.Tickets.Remove(ticket);

  await _context.SaveChangesAsync();

  return NoContent();
}

}

