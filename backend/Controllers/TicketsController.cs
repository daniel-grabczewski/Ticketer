using Microsoft.AspNetCore.Mvc;
using backend.Models; // Assuming you have a Ticket model class created in Models folder
using backend.Data;
using Microsoft.EntityFrameworkCore;

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

[HttpGet]
public async Task<IActionResult> GetAllTicketsAsync() 
{
    // Retrieve all tickets from the database asynchronously
    var tickets = await _context.Tickets.ToListAsync();
    Console.WriteLine(tickets);
    // Return the list of tickets with a 200 OK response
    return Ok(tickets);
}

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteTicketById(int id) {
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

