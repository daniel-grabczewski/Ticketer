using Microsoft.AspNetCore.Mvc;
using backend.Models; // Assuming you have a Ticket model class created in Models folder
using backend.Data;

[ApiController]
[Route("api/[controller]")]  // Route: /api/tickets

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
        // Print out the ticket data
        Console.WriteLine($"Received ticket: {newTicket.Description}");

        // Add the new ticket to the context
    await _context.Tickets.AddAsync(newTicket);

    // Save changes to the database
    await _context.SaveChangesAsync();

        // Return a simple message for now
        return Ok(new { Message = "Ticket saved successfully!" });
    }
}

