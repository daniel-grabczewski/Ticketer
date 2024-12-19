using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using YourProject.Models;

namespace backend.Controllers
{
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
      public async Task<IActionResult> GenerateGuestId()
      {
          string guestId = Guid.NewGuid().ToString(); 

          var guestUser = new User
          {
              Id = guestId,
              UserName = "Guest",
              IsGuest = true
          };

          await _context.Users.AddAsync(guestUser);
          await _context.SaveChangesAsync();

          // Call the separate method to seed the board
          var boardId = await BoardSeeder.SeedGuestBoardAsync(_context, guestId);

          CookieOptions options = new CookieOptions
          {
              Expires = DateTime.Now.AddDays(30),
              HttpOnly = false,
              Secure = false,
              Path = "/",
          };

          Response.Cookies.Append("GuestId", guestId, options);

          return Ok(new { GuestId = guestId, BoardId = boardId });
      }


        // GET: api/auth/hasGuestData
       [HttpGet("hasGuestData")]
[Authorize]
public async Task<IActionResult> HasGuestData()
{
    Console.WriteLine("HasGuestData endpoint called.");

    // Check Auth0 user ID from the token
    string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    Console.WriteLine($"Auth0 user ID from token: {auth0UserId}");

    // Check if GuestId cookie exists
    string guestId = Request.Cookies["GuestId"];
    Console.WriteLine($"GuestId from cookie: {guestId}");

    // If we have an Auth0 user ID, determine if that user is registered
    User authUser = null;
    if (!string.IsNullOrEmpty(auth0UserId))
    {
        authUser = await _context.Users.FindAsync(auth0UserId);
    }

    // Logic:
    // 1) If Auth0 user is registered, they should have no need for guest data.
    //    Return false because we won't be transferring guest data now.
    // 2) If Auth0 user is not registered, check if guest data exists.
    //    This means we should look up by GuestId cookie if present.
    // 3) If no Auth0 user ID (somehow), fallback to guest logic.

    if (!string.IsNullOrEmpty(auth0UserId))
    {
        if (authUser != null)
        {
            // Auth0 user is registered, no guest data needed
            Console.WriteLine("Auth0 user is registered. No guest data transfer needed.");
            return Ok(new { HasGuestData = false });
        }
        else
        {
            // Auth0 user not registered yet. Possibly want to transfer guest data.
            // Check GuestId cookie and guest user data.
            if (string.IsNullOrEmpty(guestId))
            {
                Console.WriteLine("Auth0 user not registered and no GuestId cookie. No guest data.");
                return Ok(new { HasGuestData = false });
            }

            var guestUser = await _context.Users
                .Include(u => u.Boards)
                .FirstOrDefaultAsync(u => u.Id == guestId && u.IsGuest);

            if (guestUser == null)
            {
                Console.WriteLine("No guest user found even though cookie exists. No guest data.");
                return Ok(new { HasGuestData = false });
            }

            bool hasGuestData = guestUser.Boards.Any();
            Console.WriteLine($"Auth0 user not registered, guest user found. Has guest data: {hasGuestData}");
            return Ok(new { HasGuestData = hasGuestData });
        }
    }
    else
    {
        // No Auth0 user ID found (unusual since [Authorize] is present),
        // fallback to original guest logic.
        Console.WriteLine("No Auth0 user ID found. Fallback to guest logic.");

        if (string.IsNullOrEmpty(guestId))
        {
            return Ok(new { HasGuestData = false });
        }

        var guestUser = await _context.Users
            .Include(u => u.Boards)
            .FirstOrDefaultAsync(u => u.Id == guestId && u.IsGuest);

        if (guestUser == null)
        {
            return Ok(new { HasGuestData = false });
        }

        bool hasGuestData = guestUser.Boards.Any();
        Console.WriteLine($"Has guest data (guest fallback): {hasGuestData}");

        return Ok(new { HasGuestData = hasGuestData });
    }
}


        // POST: api/auth/transferGuestData
        [HttpPost("transferGuestData")]
        [Authorize]
        public async Task<IActionResult> TransferGuestData()
        {
            // Get Auth0 user ID
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

            // Retrieve guest user
            var guestUser = await _context.Users
                .Include(u => u.Boards)
                    .ThenInclude(b => b.Lists)
                        .ThenInclude(l => l.Tickets)
                .FirstOrDefaultAsync(u => u.Id == guestId && u.IsGuest);

            if (guestUser == null)
            {
                // Remove the GuestId cookie
                Response.Cookies.Delete("GuestId");
                return BadRequest("No guest data to transfer.");
            }

            // Retrieve or create authenticated user
            var authUser = await _context.Users
                .Include(u => u.Boards)
                .FirstOrDefaultAsync(u => u.Id == auth0UserId);

            if (authUser == null)
            {
                authUser = new User
                {
                    Id = auth0UserId,
                    UserName = User.Identity.Name ?? "User", // Use Auth0 username or default
                    IsGuest = false
                };
                _context.Users.Add(authUser);
                await _context.SaveChangesAsync();
            }

            // Transfer boards from guest to authenticated user
            foreach (var board in guestUser.Boards)
            {
                board.UserId = authUser.Id;
                board.User = authUser;
            }

            // Remove guest user
            _context.Users.Remove(guestUser);

            // Remove the GuestId cookie
            Response.Cookies.Delete("GuestId");

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Guest data transferred and user registered successfully." });
        }

        // POST: api/auth/deleteGuestData
        [HttpPost("deleteGuestData")]
        [Authorize]
        public async Task<IActionResult> DeleteGuestData()
        {
            // Get Auth0 user ID
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Check if GuestId cookie exists
            string guestId = Request.Cookies["GuestId"];
            if (string.IsNullOrEmpty(guestId))
            {
                return BadRequest("Guest ID not found.");
            }

            // Retrieve guest user
            var guestUser = await _context.Users
                .Include(u => u.Boards)
                    .ThenInclude(b => b.Lists)
                        .ThenInclude(l => l.Tickets)
                .FirstOrDefaultAsync(u => u.Id == guestId && u.IsGuest);

            if (guestUser != null)
            {
                // Remove guest user and associated data
                _context.Users.Remove(guestUser);
            }

            // Remove the GuestId cookie
            Response.Cookies.Delete("GuestId");

            // Register authenticated user if not already registered
            if (!string.IsNullOrEmpty(auth0UserId))
            {
                var authUser = await _context.Users.FindAsync(auth0UserId);
                if (authUser == null)
                {
                    authUser = new User
                    {
                        Id = auth0UserId,
                        UserName = User.Identity.Name ?? "User", // Use Auth0 username or default
                        IsGuest = false
                    };
                    _context.Users.Add(authUser);
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
            // Get Auth0 user ID
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(auth0UserId))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Check if user is registered
            var authUser = await _context.Users.FindAsync(auth0UserId);
            if (authUser == null)
            {
                return BadRequest("User is not registered.");
            }

            // Check if GuestId cookie exists
            string guestId = Request.Cookies["GuestId"];
            if (!string.IsNullOrEmpty(guestId))
            {
                // Retrieve guest user
                var guestUser = await _context.Users
                    .Include(u => u.Boards)
                        .ThenInclude(b => b.Lists)
                            .ThenInclude(l => l.Tickets)
                    .FirstOrDefaultAsync(u => u.Id == guestId && u.IsGuest);

                if (guestUser != null)
                {
                    // Remove guest user and associated data
                    _context.Users.Remove(guestUser);
                }

                // Remove the GuestId cookie
                Response.Cookies.Delete("GuestId");

                await _context.SaveChangesAsync();
            }

            return Ok(new { Message = "Guest data deleted for registered user." });
        }
    }
}
