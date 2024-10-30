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
            string guestId = Guid.NewGuid().ToString(); // Generate unique guest ID

            // Create a guest user in the database
            var guestUser = new User
            {
                Id = guestId,
                UserName = "Guest", // You can generate a unique guest username if needed
                IsGuest = true
            };

            await _context.Users.AddAsync(guestUser);
            await _context.SaveChangesAsync();

            CookieOptions options = new CookieOptions
            {
                Expires = DateTime.Now.AddDays(30), // 30-day expiry
                HttpOnly = false, // Set to false if you need JavaScript access
                Secure = false,   // Should be true in production with HTTPS
                //SameSite = SameSiteMode.None, // Uncomment if necessary
                //Domain = "localhost", // Uncomment if necessary
                Path = "/", // Ensure the cookie is available to all paths
            };

            Response.Cookies.Append("GuestId", guestId, options); // Store guest ID in a cookie

            return Ok(new { GuestId = guestId });
        }

        // GET: api/auth/hasGuestData
        [HttpGet("hasGuestData")]
        [Authorize]
        public async Task<IActionResult> HasGuestData()
        {
            Console.WriteLine("HasGuestData endpoint called.");

            // Check if GuestId cookie exists
            string guestId = Request.Cookies["GuestId"];
            Console.WriteLine($"GuestId from cookie: {guestId}");

            if (string.IsNullOrEmpty(guestId))
            {
                return Ok(new { HasGuestData = false });
            }

            // Retrieve guest user and check for associated boards
            var guestUser = await _context.Users
                .Include(u => u.Boards)
                .FirstOrDefaultAsync(u => u.Id == guestId && u.IsGuest);

            if (guestUser == null)
            {
                return Ok(new { HasGuestData = false });
            }

            bool hasGuestData = guestUser.Boards.Any();

            Console.WriteLine($"Has guest data: {hasGuestData}");

            return Ok(new { HasGuestData = hasGuestData });
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
