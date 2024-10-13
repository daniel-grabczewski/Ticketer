using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/auth/generateGuestId
    [HttpGet("generateGuestId")]
    public IActionResult GenerateGuestId()
    {
        string guestId = Guid.NewGuid().ToString(); // Generate unique guest ID
        CookieOptions options = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(30), // 30-day expiry
            HttpOnly = false, // Set to false if you need JavaScript access
            Secure = false,   // Should be false in development (requires HTTPS if true)
            SameSite = SameSiteMode.Lax // Use Lax or Strict instead of None
        };

        Response.Cookies.Append("GuestId", guestId, options); // Store guest ID in a cookie

        return Ok(new { GuestId = guestId });
    }

    // POST: api/auth/transferGuestData
    [HttpPost("transferGuestData")]
    [Authorize]
    public async Task<IActionResult> TransferGuestData()
    {
        // Check if user is authenticated
        string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(auth0UserId))
        {
            return Unauthorized("User is not authenticated.");
        }

        // Check if GuestId cookie exists
        string guestId = Request.Cookies["GuestId"];
        if (string.IsNullOrEmpty(guestId))
        {
            return BadRequest("Guest ID not found.");
        }

        // Retrieve guest tickets
        var guestTickets = await _context.Tickets
            .Where(t => t.UserId == guestId && t.IsGuest)
            .ToListAsync();

        if (!guestTickets.Any())
        {
            // Remove the GuestId cookie
            Response.Cookies.Delete("GuestId");
            return BadRequest("No guest data to transfer.");
        }

        // Transfer tickets to Auth0 user
        foreach (var ticket in guestTickets)
        {
            ticket.UserId = auth0UserId;
            ticket.IsGuest = false;
        }

        // Remove the GuestId cookie
        Response.Cookies.Delete("GuestId");

        // Register the user if not already registered
        bool userExists = await _context.Users.AnyAsync(u => u.UserId == auth0UserId);
        if (!userExists)
        {
            var user = new User
            {
                UserId = auth0UserId
            };
            await _context.Users.AddAsync(user);
        }

        await _context.SaveChangesAsync();

        return Ok(new { Message = "Guest data transferred and user registered successfully." });
    }

    // POST: api/auth/deleteGuestData
    [HttpPost("deleteGuestData")]
    [Authorize]
    public async Task<IActionResult> DeleteGuestData()
    {
        // Check if user is authenticated
        string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Check if GuestId cookie exists
        string guestId = Request.Cookies["GuestId"];
        if (string.IsNullOrEmpty(guestId))
        {
            return BadRequest("Guest ID not found.");
        }

        // Delete guest tickets
        var guestTickets = await _context.Tickets
            .Where(t => t.UserId == guestId && t.IsGuest)
            .ToListAsync();

        if (guestTickets.Any())
        {
            _context.Tickets.RemoveRange(guestTickets);
        }

        // Remove the GuestId cookie
        Response.Cookies.Delete("GuestId");

        // Register the user if authenticated and not already registered
        if (!string.IsNullOrEmpty(auth0UserId))
        {
            bool userExists = await _context.Users.AnyAsync(u => u.UserId == auth0UserId);
            if (!userExists)
            {
                var user = new User
                {
                    UserId = auth0UserId
                };
                await _context.Users.AddAsync(user);
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new { Message = "Guest data deleted and user registered successfully." });
    }

    // POST: api/auth/deleteGuestDataForRegisteredUser
    [HttpPost("deleteGuestDataForRegisteredUser")]
    [Authorize]
    public async Task<IActionResult> DeleteGuestDataForRegisteredUser()
    {
        // Check if user is authenticated
        string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(auth0UserId))
        {
            return Unauthorized("User is not authenticated.");
        }

        // Check if user is already registered
        bool userExists = await _context.Users.AnyAsync(u => u.UserId == auth0UserId);
        if (!userExists)
        {
            return BadRequest("User is not registered.");
        }

        // Check if GuestId cookie exists
        string guestId = Request.Cookies["GuestId"];
        if (!string.IsNullOrEmpty(guestId))
        {
            // Delete guest tickets
            var guestTickets = await _context.Tickets
                .Where(t => t.UserId == guestId && t.IsGuest)
                .ToListAsync();

            if (guestTickets.Any())
            {
                _context.Tickets.RemoveRange(guestTickets);
            }

            // Remove the GuestId cookie
            Response.Cookies.Delete("GuestId");

            await _context.SaveChangesAsync();
        }

        return Ok(new { Message = "Guest data deleted for registered user." });
    }
}
